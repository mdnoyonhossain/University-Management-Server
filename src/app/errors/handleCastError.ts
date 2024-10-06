import httpStatus from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import { Error } from "mongoose";

const handleCastError = (err: Error.CastError): TGenericErrorResponse => {
    const statusCode = httpStatus.NOT_FOUND;
    const errorSources: TErrorSources = [{
        path: err?.path,
        message: err?.message
    }]

    return {
        statusCode,
        message: "Invalid ID",
        errorSources
    }
}

export default handleCastError;