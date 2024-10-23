import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...allowedRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.")
        }

        jwt.verify(token, config.jwt_access_secret as string, function (err, decoded) {
            if (err) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
            }

            if (allowedRoles && !allowedRoles.includes((decoded as JwtPayload)?.role)) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Access forbidden: insufficient permissions.");
            }

            req.user = decoded;
            next();
        });

    });
}

export default auth;