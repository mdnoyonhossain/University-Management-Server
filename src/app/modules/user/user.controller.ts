import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;
    const result = await UserServices.createStudentIntoDB(password, student)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Student Created Successfully!",
        data: result
    })
});

export const UserController = {
    createStudent
}