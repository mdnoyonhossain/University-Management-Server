import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TChangePassword, TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";

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

    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: config.jwt_access_expires_in });

    return {
        accessToken,
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

export const AuthServices = {
    loginUser,
    changePasswordIntoDB
}