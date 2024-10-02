import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({
        sucess: false,
        message,
        error: err
    })
}

export default globalErrorHandler;