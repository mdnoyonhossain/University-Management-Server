import httpStatus from "http-status";
import { Error } from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (err: Error.ValidationError): TGenericErrorResponse => {
    const statusCode = httpStatus.NOT_FOUND;
    const errorSources: TErrorSources = Object.values(err.errors).map((val: Error.ValidatorError | Error.CastError) => {
        return {
            path: val?.path,
            message: val?.message
        }
    })

    return {
        statusCode,
        message: "Validation Error",
        errorSources
    }
}

export default handleValidationError;