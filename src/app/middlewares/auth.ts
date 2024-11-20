import httpStatus from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...allowedRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.")
        }

        let decoded;

        try {
            decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are Not Authorized");
        }

        const user = await User.isUserExistsByCustomId(decoded?.userId);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
        }

        const isUserDeleted = user?.isDeleted;
        if (isUserDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, "This user is Deleted!");
        }

        const userStatus = user?.status;
        if (userStatus === "blocked") {
            throw new AppError(httpStatus.FORBIDDEN, "This user is Blocked");
        }

        if (user?.passwordChangedAt && User.isJWTIssudeBeforePasswordChanged(user.passwordChangedAt, decoded?.iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token is invalid or has expired. Please log in again.");
        }

        if (allowedRoles && !allowedRoles.includes(decoded?.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Access forbidden: insufficient permissions.");
        }

        req.user = decoded;
        next();
    });
}

export default auth;