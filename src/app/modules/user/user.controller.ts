import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import AppError from '../../errors/AppError';

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(password, studentData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created succesfully',
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;

    const result = await UserServices.createFacultyIntoDB(password, facultyData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is created succesfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    const result = await UserServices.createAdminIntoDB(password, adminData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created succesfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user;
    const result = await UserServices.getMe(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrived succesfully',
        data: result,
    });
});

const userChangeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const statusData = req.body;
    const result = await UserServices.userChangeStatus(id, statusData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Change Status succesfully',
        data: result,
    });
})

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    userChangeStatus
}