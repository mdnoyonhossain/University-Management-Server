import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const semesterRegistration = req.body;
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(semesterRegistration);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Semester Registration is created successfull",
        data: result
    })
})

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration is Retrived successfull",
        data: result
    })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration is Retrived successfull",
        data: result
    })
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateRegistrationData = req.body;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, updateRegistrationData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration is Updated successfull",
        data: result
    })
})

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration
}