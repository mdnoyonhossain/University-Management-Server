import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TChangePassword, TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistsByCustomId(payload?.id);

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

    if (!await User.isPasswordMatched(payload?.password, user?.password)) {
        throw new AppError(httpStatus.FORBIDDEN, "Password do not Matched!");
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    const refreshToken = createToken(jwtPayload, config.jwt_refrest_secret as string, config.jwt_refresh_expires_in as string);

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange
    }
}

const changePasswordIntoDB = async (userData: JwtPayload, payload: TChangePassword) => {
    const user = await User.isUserExistsByCustomId(userData?.userId);

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

    if (!await User.isPasswordMatched(payload?.oldPassword, user?.password)) {
        throw new AppError(httpStatus.FORBIDDEN, "Password do not Matched!");
    }

    const newHashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_round))

    await User.findOneAndUpdate(
        { id: userData?.userId, role: userData?.role },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        },
        { new: true, runValidators: true }
    );

    return null;
}

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(token, config.jwt_refrest_secret as string) as JwtPayload;

    const user = await User.isUserExistsByCustomId(decoded?.userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found. The account associated with this token no longer exists. Please sign up or contact support for assistance.");
    }

    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user account has been deleted. If this was a mistake, please contact support.");
    }

    if (user?.status === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user account is currently blocked. Please contact support for further information.");
    }

    if (user?.passwordChangedAt && User.isJWTIssudeBeforePasswordChanged(user.passwordChangedAt, decoded?.iat as number)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Your token is no longer valid because your password was changed. Please log in again with your updated credentials.");
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return {
        accessToken
    }
};


export const AuthServices = {
    loginUser,
    changePasswordIntoDB,
    refreshToken
}