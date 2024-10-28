import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TFaculty } from '../Faculty/faculty.interface';
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import { Admin } from '../Admin/admin.model';
import { USER_ROLE } from './user.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);
    userData.role = 'student';
    userData.email = payload.email;

    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(400, 'Admission semester not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        userData.id = await generateStudentId(admissionSemester);
        const newUser = await User.create([userData], { session });

        const imageName = `${userData.id}${payload?.name?.firstName}`;
        const { secure_url } = await sendImageToCloudinary(imageName, file?.path);

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        payload.profileImg = secure_url as string;

        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);

    userData.role = 'faculty';
    userData.email = payload.email;

    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        userData.id = await generateFacultyId();
        const newUser = await User.create([userData], { session })
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        const imageName = `${userData.id}${payload?.name?.firstName}`;
        const { secure_url } = await sendImageToCloudinary(imageName, file?.path);

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        payload.profileImg = secure_url as string;

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const createAdminIntoDB = async (file: any, password: string, payload: TFaculty) => {
    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);
    userData.role = 'admin';
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        userData.id = await generateAdminId();

        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        const imageName = `${userData.id}${payload?.name?.firstName}`;
        const { secure_url } = await sendImageToCloudinary(imageName, file?.path);

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        payload.profileImg = secure_url as string;

        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMe = async (userId: string, role: string) => {
    let result = null;

    if (role === USER_ROLE.admin) {
        result = await Admin.findOne({ id: userId }).populate("user");
    }
    if (role === USER_ROLE.faculty) {
        result = await Faculty.findOne({ id: userId }).populate("user");
    }
    if (role === USER_ROLE.student) {
        result = await Student.findOne({ id: userId }).populate('user').populate('admissionSemester').populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty'
            }
        });
    }

    return result;
}

const userChangeStatus = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    userChangeStatus
};