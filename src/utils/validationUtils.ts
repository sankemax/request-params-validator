import { dateValidator, stringValidator, booleanValidator, intValidator, emailValidator, uuidValidator, authTokenValidator, listValidator } from "../validation/functions";
import { Validation, ValidatorFn, Predicate } from "../models/types";

// best if validations were made with a designated library, but this is enough for DEV
// UUID - a guid composed of dashes (-), numbers and English letters (example: “46da6390-7c78-4a1c-9efa-7c0396067ce4”)
// Auth-Token - authentication token that starts with “Bearer” and continues with a token composed of letters and numbers. (example: “Bearer ebb3cbbe938c4776bd22a4ec2ea8b2ca”)

export const dateRegex = /^(?:0[1-9]{1}|[1-3][0-9]{1})-(?:0[1-9]{1}|1[0-2]{1})-(?:\d\d\d\d)$/;
export const uuidRegex = /^[\-0-9a-zA-Z]{5,}$/
export const authTokenRegex = /^Bearer (?:[0-9a-zA-Z])$/

// this was pasted from stack-overflow
export const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function validationErrorMessage(expectedType: string, value: string): string {
    const gotType = getParamType(value);
    return `Expected type ${expectedType}. Got type ${gotType} for value: ${value}.`;
}

export function requiredFieldErrorMessage(expectedField: string): string {
    return `Expected required field ${expectedField} to exist.`
}

export function reduceValidationErrors(acc: Validation, validationResult: Validation) {
    return { errors: [...acc.errors, ...validationResult.errors] };
}

export function getParamType(param: any): string {
    const initialValue = { validated: false, type: '' };

    const stringCheck = [

        stringValidator(),
        dateValidator(),
        emailValidator(),
        uuidValidator(),
        authTokenValidator(),

    ].reduce(validationReducer(param), initialValue);

    if (stringCheck.validated) {
        return stringCheck.type;
    }

    const additionalChecks = [

        booleanValidator(),
        intValidator(),
        listValidator(),

    ].reduce(validationReducer(param), initialValue);

    return additionalChecks.validated ? additionalChecks.type : 'UNKNOWN TYPE'
}

function validationReducer(param: any) {
    return function withParam(check: { validated: boolean, type: string }, validator: ValidatorFn) {
        return check.validated
            ? check
            : { validated: validator.fn(param), type: validator.name };
    }
}

export function generateValidatorFnsMap(): Map<string, Predicate> {
    return new Map(
        [
            stringValidator(),
            intValidator(),
            dateValidator(),
            booleanValidator(),
            emailValidator(),
            uuidValidator(),
            authTokenValidator(),
            listValidator(),
        ]
            .map(obj => [obj.name, obj.fn])
    )
}
