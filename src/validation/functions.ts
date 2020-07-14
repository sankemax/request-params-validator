import { ValidatorFn } from "../models/types"
import { dateRegex, emailRegex, uuidRegex, authTokenRegex } from "../utils/validationUtils"

export function stringValidator(): ValidatorFn {
    return {
        name: 'String',
        fn: (validate: any) => typeof validate == 'string',
    }
}

export function intValidator(): ValidatorFn {
    return {
        name: 'Int',
        fn: (validate: any) => Number.isInteger(validate),
    }
}

// dd-mm-yyyy
export function dateValidator(): ValidatorFn {
    return {
        name: 'Date',
        fn: (validate: any) => typeof validate == 'string'
            && dateRegex.test(validate),
    }
}

export function booleanValidator(): ValidatorFn {
    return {
        name: 'Boolean',
        fn: (validate: any) => typeof validate == 'boolean',
    }
}

export function emailValidator(): ValidatorFn {
    return {
        name: 'Email',
        fn: (validate: any) => typeof validate == 'string'
            && emailRegex.test(validate),
    }
}

export function uuidValidator(): ValidatorFn {
    return {
        name: 'UUID',
        fn: (validate: any) => typeof validate == 'string'
            && uuidRegex.test(validate),
    }
}

export function authTokenValidator(): ValidatorFn {
    return {
        name: 'Auth-Token',
        fn: (validate: any) => typeof validate == 'string'
            && authTokenRegex.test(validate),
    }
}
