import { MissingParamError, IdError, TypeError } from "./Errors"

export interface Obj {
    [key: string]: any
}

export interface ValidationObj {
    name: string
    types: string[]
    required: boolean
}

export interface ObjectValue {
    name: string
    value: any
}

export interface Validation {
    errors: ValidationError[]
}

export interface ValidationError extends TypeError, MissingParamError, IdError {}

export interface ValidatorFn {
    name: string
    fn: Predicate
}

export interface Predicate {
    (validate: any): boolean
}

export type Method = 'POST' | 'GET' | 'PUT' | 'PATCH' // TODO: add all methods

export type ID = string
