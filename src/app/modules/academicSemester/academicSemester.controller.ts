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

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semester Retrive Successfully!",
        data: result
    })
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semester Retrive Successfully!",
        data: result
    })
});

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const semesterData = req.body;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semesterId, semesterData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Semester Updated Successfully!",
        data: result
    })
})

export const AcademicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester
}