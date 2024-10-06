import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong!';
    let errorSources: TErrorSources = [{
        path: '',
        message: 'Something went wrong!'
    }]

    const handleZodError = (err: ZodError) => {
        const statusCode = 400;
        const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
            return {
                path: issue.path[issue.path.length - 1],
                message: issue.message
            }
        })

        return {
            statusCode,
            message: "Validation Error",
            errorSources,
        }
    }

    if (err instanceof ZodError) {
        const simplefiedError = handleZodError(err);
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