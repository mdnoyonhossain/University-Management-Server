import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const academicFaculty = req.body;
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(academicFaculty);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Academic Faculty Created Successfully",
        data: result
    })
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Faculty Retrived Successfully",
        data: result
    })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Faculty Retrived Successfully",
        data: result
    })
})
const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const academicFacultyData = req.body;
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(facultyId, academicFacultyData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Faculty Updated Successfully",
        data: result
    })
})

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}