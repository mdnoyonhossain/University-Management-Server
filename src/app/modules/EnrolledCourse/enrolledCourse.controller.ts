import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Student is Enrolled Successfully!",
        data: result
    })
});

export const EnrolledCourseController = {
    createEnrolledCourse
}