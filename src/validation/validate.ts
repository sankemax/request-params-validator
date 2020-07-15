import { Obj, Validation, ValidationObj, ObjectValue, Predicate, ValidatorFn, ValidationError } from "../models/types";
import { getId } from "../utils/schemaUtil";
import { Schema } from "../models/Schema";
import { reduceValidationErrors, validationErrorMessage, requiredFieldErrorMessage, generateValidatorFnsMap } from "../utils/validationUtils";
import { Datastore } from "../models/Datastore";

/**
 * Primary validation logic: here one can add more principal validation types
 * Currently:
 *  1. Required *root* fields (query_params/headers/body) validation
 *  2. Execution of validation per param
 * Possible:
 *  pre processing of request object: enrich from other sources, etc.
 * @param request the object that is being validated
 */
export function validateObject(store: Datastore) {
    return async function withDependencies(request: Obj): Promise<Validation> {
        try {
            const id = getId(request.path, request.method);
            const schema: Schema = await store.load(id);

            const { errors: requiredRootFieldErrors, existing: rootsToValidate } = requiredRootFields(schema, request);

            const { errors: validationResults } = rootsToValidate
                .map(root => validateRoot(`${schema.path}-${schema.method}.${root}`, schema[root], request[root]))
                .reduce(reduceValidationErrors, { errors: [] })

            return { errors: [...requiredRootFieldErrors, ...validationResults] }
        } catch (error) {
            return { errors: [{ message: error.message, path: '' }] }
        }
    }

}

/**
 * Validation of root fields
 * @param schema 
 * @param request 
 */
function requiredRootFields(schema: Schema, request: Obj): Validation & { existing: string[] } {
    const requiredRootEntries = Object
        .entries(schema)
        .filter(([_, value]) => value.length > 0);

    const missingRoots = requiredRootEntries
        .map(([rootKey, _]) => rootKey)
        .filter(rootKey => !request[rootKey])

    const rootsToValidate = requiredRootEntries
        .map(([requiredRoot, _]) => requiredRoot)
        .filter(requiredRoot => !missingRoots.includes(requiredRoot));

    return {
        errors: missingRoots.map(rootKey => ({ message: `missing root key ${rootKey}`, path: `${schema.path}-${schema.method}` })),
        existing: rootsToValidate.filter(toValidate => toValidate.toLowerCase() != 'path' && toValidate.toLowerCase() != 'method'),
    }
}

/**
 * Primary logic of validation per param
 * @param rootPath query_params/headers/body
 * @param validationArray the models that the request is being validated against
 * @param objParamsArray the request params
 */
function validateRoot(rootPath: string, validationArray: ValidationObj[], objParamsArray: ObjectValue[]): Validation {
    const requestParamsMap: Map<string, any> = objParamsArray.reduce(
        (helperMap, objParam) => {
            helperMap.set(objParam.name, objParam.value);
            return helperMap;
        },
        new Map()
    );

    const requiredFieldErrors = validationArray
        .filter(validationObj => validationObj.required)
        .flatMap(validateRequiredFields(requestParamsMap, rootPath))

    const validationErrors = validationArray
        .filter(validationObj => requestParamsMap.has(validationObj.name))
        .flatMap(validateSingleObject(requestParamsMap, rootPath));

    return { errors: [...requiredFieldErrors, ...validationErrors] };
}

function validateRequiredFields(requestParamsMap: Map<string, any>, rootPath: string) {
    return function withParamsMap(validationObj: ValidationObj): ValidationError[] {
        return requestParamsMap.has(validationObj.name)
            && requestParamsMap.get(validationObj.name) != null
            ? []
            : [{ message: requiredFieldErrorMessage(validationObj.name), path: rootPath }]
    }
}

function validateSingleObject(requestParamsMap: Map<string, any>, rootPath: string) {
    return function withMetadata(validationObj: ValidationObj): ValidationError[] {
        const validationFns = relevantValidationFn(validationObj.types);
        const value = requestParamsMap.get(validationObj.name);
        const validations = validationFns.reduce(
            accumulateValidations(rootPath, value, validationObj),
            { errors: [], valid: false }
        );

        return validations.valid ? [] : validations.errors;
    }
}

function accumulateValidations(rootPath: string, value: any, validationObj: ValidationObj) {
    return function withMetadata(acc: Validation & { valid: boolean }, validationFn: ValidatorFn): Validation & { valid: boolean } {
        if (acc.valid) {
            return acc;
        }

        if (validationFn.fn(value)) {
            return {
                valid: true,
                errors: [],
            }
        }

        const path = `${rootPath}.${validationObj.name}`;
        const message = validationErrorMessage(validationFn.name);
        return {
            valid: false,
            errors: [...acc.errors, { path, message, }],
        }
    }
}


const validatorFnsMap = generateValidatorFnsMap();
/**
 * the assumption is that the validation function always exists.
 * if needed, a default function can be returned which emits an
 * error => 'validation function named ${name} doesnt exist'
 * @param types validation function types required (String, Int, etc.)
 */
function relevantValidationFn(types: string[]): ValidatorFn[] {
    return types.map(type => ({
        name: type,
        fn: validatorFnsMap.get(type) as Predicate,
    }));
}
