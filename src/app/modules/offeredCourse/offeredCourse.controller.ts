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

export const OfferedCourseController = {
    createOfferedCourse,
    updateOfferedCourse
}