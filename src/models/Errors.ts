export interface Error {
    message: string
}

export interface TypeError extends Error {
    path: string
}

export interface MissingParamError extends Error {}

export interface IdError extends Error {}
