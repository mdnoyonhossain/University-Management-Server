import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

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

const changePasswordIntoDB = async (user: JwtPayload, payload: string) => {

}

export const AuthServices = {
    loginUser,
    changePasswordIntoDB
}