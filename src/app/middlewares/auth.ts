import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";

const auth = () => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization;
        if(!token){
            throw new AppError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.")
        }

        return next();
    });
}

export default auth;