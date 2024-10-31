import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const offeredCourseData = req.body;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, offeredCourseData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Student is Enrolled Successfully!",
        data: result
    })
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.userId;
    const updateStudentMarkData = req.body;
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, updateStudentMarkData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Mark is Update Successfully!",
        data: result
    })
});

export const EnrolledCourseController = {
    createEnrolledCourse,
    updateEnrolledCourseMarks
}