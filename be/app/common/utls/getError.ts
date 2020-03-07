import mongoose from 'mongoose';
import * as yup from 'yup'


const InternalServerError = 'InternalServerError';
const ValidationError = 'ValidationError';
const GeneralError = 'GeneralError';

type TypeObject = {
    InternalServerError: typeof InternalServerError
    ValidationError: typeof ValidationError
    GeneralError: typeof GeneralError
}

export const type: TypeObject = {
    InternalServerError,
    ValidationError,
    GeneralError,

}

type Type = 
    typeof InternalServerError | 
    typeof ValidationError | 
    typeof GeneralError

type ErrorObject = mongoose.Error.ValidationError | yup.ValidationError | Error

type GeneralErrorParams = {
    error?:  ErrorObject            // MongoError
    type?: Type
    message?: string
}

type GeneralError = {
    type: Type
    message?: string
}
type ValidationError = {
    type: string
    message: string
    errors: string[]
    inner: object[]
}
/*
type ValidationError = {
    // yup
    type: string
    message: string
    errors: string[]
    value: object
    inner: object[]
} | {
    // mongo
    type: string
    message: string 
    errors: object
}
*/
type GetGeneralError = (params?: GeneralErrorParams) => GeneralError | ValidationError

// getError ?
export const getGeneralError: GetGeneralError = (params = {}) => {

    const { error, type = GeneralError, message } = params;
    const errorMessage = message || (error && error.message);
    const errorType = getErrorType(error);

    if(errorType === 'GeneralError'){
        return {
            type,
            message: errorMessage
        }     
    }else{
        // ValidationErrorMongo | ValidationErrorYup
        if(errorMessage){
            error.message = errorMessage;
        }
        return getValidationError(error)
    }


}


type GetValidationError = (error: ErrorObject) =>  ValidationError
export const getValidationError: GetValidationError = (error) =>  {
    const errorType = getErrorType(error);

    //return error;
    if(errorType === 'ValidationErrorYup'){
        const { name, inner, value, errors, message: yupMessage } = error as yup.ValidationError;
        return {
            type: name,
            message: yupMessage,
            // value,
            errors,
            inner: inner.map( x => ({
                path: x.path,
                message: x.message,
                errors: x.errors,
                type: x.type,
                params: x.params,
                inner: x.inner,
            }))
            
        }
    }else{
        const { name, errors:mongoErrors, message: mongoMessage } = error as mongoose.Error.ValidationError;
        const { errors, inner } = mapAsYupError(mongoErrors)
        return {
            type: name,
            message: mongoMessage,
            errors,
            inner
        }

    }




}

type GetErrorType = (error) => 'ValidationErrorMongo' | 'ValidationErrorYup' | 'GeneralError'


const getErrorType: GetErrorType = (error: ErrorObject) => {
    const isMongo = error instanceof mongoose.Error.ValidationError
    const isYup = error instanceof yup.ValidationError

    if(isMongo){return 'ValidationErrorMongo';}
    if(isYup){return 'ValidationErrorYup';}
    return 'GeneralError';
}


// map as yup
const mapAsYupError = (errors: mongoose.Error.ValidationError['errors']) => {
    const errorsList = []
    const innerList = Object.keys(errors).map(key => {
        const error = errors[key];
        const { path, message } = error;
        errorsList.push(message)
        return {
            path, message
        }
    })

    return {
        errors: errorsList,
        inner: innerList
    }
} 