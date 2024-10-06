import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong!';
    let errorSources: TErrorSources = [{
        path: '',
        message: 'Something went wrong!'
    }]

    if (err instanceof ZodError) {
        const simplefiedError = handleZodError(err);
        statusCode = simplefiedError?.statusCode;
        message = simplefiedError?.message;
        errorSources = simplefiedError?.errorSources;
    } else if (err.name === 'ValidationError') {
        const simplefiedError = handleValidationError(err);
        statusCode = simplefiedError?.statusCode;
        message = simplefiedError?.message;
        errorSources = simplefiedError?.errorSources;
    } else if (err?.name === 'CastError') {
        const simplefiedError = handleCastError(err);
        statusCode = simplefiedError?.statusCode;
        message = simplefiedError?.message;
        errorSources = simplefiedError?.errorSources;
    } else if (err?.code === 11000) {
        const simplefiedError = handleDuplicateError(err);
        statusCode = simplefiedError?.statusCode;
        message = simplefiedError?.message;
        errorSources = simplefiedError?.errorSources;
    }

    res.status(statusCode).json({
        sucess: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? err?.stack : null
    })
}

export default globalErrorHandler;