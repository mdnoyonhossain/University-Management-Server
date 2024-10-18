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

export const OfferedCourseController = {
    createOfferedCourse
}