import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
    const loginData = req.body;
    const result = await AuthServices.loginUser(loginData);
    const { refreshToken, accessToken, needsPasswordChange } = result;

    // set cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production"
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Login Successfully!",
        data: {
            accessToken,
            needsPasswordChange
        }
    })
})

const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    const result = await AuthServices.changePasswordIntoDB(user, passwordData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Password Changed Successfully!",
        data: result
    })
})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token generate Successfully!",
        data: result
    })
})

export const AuthController = {
    loginUser,
    changePassword,
    refreshToken
}