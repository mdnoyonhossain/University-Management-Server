import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
    const academicSemester = req.body;
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(academicSemester);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Academic Semester Created Successfully!",
        data: result
    })
});

export const AcademicSemesterController = {
    createAcademicSemester
}