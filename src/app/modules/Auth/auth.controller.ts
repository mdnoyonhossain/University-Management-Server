import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const loginData = req.body;
    const result = await AuthServices.loginUser(loginData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Login Successfully!",
        data: result
    })
})

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await AuthServices.changePasswordIntoDB(user, userPassword);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Password Changed Successfully!",
        data: null
    })
})

export const AuthController = {
    loginUser,
    changePassword
}