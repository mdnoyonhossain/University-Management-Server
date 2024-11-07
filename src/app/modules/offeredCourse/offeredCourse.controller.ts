import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
    const offeredCourseData = req.body;
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(offeredCourseData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Offerd Course is created Successfully!",
        data: result
    })
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offerd Course is retrived Successfully!",
        data: result
    })
});

const getMyOfferedCourse = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await OfferedCourseServices.getMyOfferedCourse(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offerd Course is retrived Successfully!",
        data: result
    })
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offerd Course is retrived Successfully!",
        data: result
    })
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const offeredCourseData = req.body;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(id, offeredCourseData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offerd Course is updated Successfully!",
        data: result
    })
});

const deleteSemesterRegistrationWithOfferedCourses = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteSemesterRegistrationWithOfferedCoursesIntoDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester registration and Offered courses deleted successfully',
        data: result
    })
});

export const OfferedCourseController = {
    createOfferedCourse,
    getAllOfferedCourse,
    getMyOfferedCourse,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteSemesterRegistrationWithOfferedCourses
}