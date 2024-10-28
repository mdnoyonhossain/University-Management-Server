import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;
    const file = req.file;
    const result = await UserServices.createStudentIntoDB(file, password, studentData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created succesfully',
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;
    const file = req.file;
    const result = await UserServices.createFacultyIntoDB(file, password, facultyData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is created succesfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;
    const file = req.file;
    const result = await UserServices.createAdminIntoDB(file, password, adminData);

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
        message: 'Status is updated succesfully',
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