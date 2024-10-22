import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {
    const isUserExists = await User.findOne({ id: payload?.id });
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    const isUserDeleted = isUserExists?.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is Deleted!");
    }

    const userStatus = isUserExists?.status;
    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is Blocked");
    }

    const isPasswordMatched = await bcrypt.compare(payload?.password, isUserExists?.password);
    console.log(isPasswordMatched);
}

export const AuthServices = {
    loginUser
}