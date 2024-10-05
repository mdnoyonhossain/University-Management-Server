import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student retrived successfully",
        data: result
    })
})

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student retrived successfully",
        data: result
    })
})

const updateStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const { student } = req.body;
    const result = await StudentServices.updateStudentIntoDB(studentId, student);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student updated successfully",
        data: result
    })
})

const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student Deleted successfully",
        data: result
    })
})

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent
}