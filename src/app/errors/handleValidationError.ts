import httpStatus from "http-status";
import { Error } from "mongoose";
import { TErrorSources } from "../interface/error";

const handleValidationError = (err: Error.ValidationError) => {
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