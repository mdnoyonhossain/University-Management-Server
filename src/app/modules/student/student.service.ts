import { startSession } from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import { ExcludeField, StudentSearchAbleFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    console.log(query);
    const queryObj = { ...query };

    let searchTerm = '';
    if (query?.searchTerm) {
        searchTerm = query.searchTerm as string;
    }

    // Searching
    const searchQuery = Student.find({
        $or: StudentSearchAbleFields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        }))
    });

    // Filtering
    ExcludeField.forEach(element => delete queryObj[element]);
    console.log({ query, queryObj });
    const filterQuery = searchQuery.find(queryObj).populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty'
        }
    });

    // sort
    let sort = '-createdAt';
    if (query?.sort) {
        sort = query?.sort as string;
    }

    const sortQuery = filterQuery.sort(sort);

    // limit
    let limit = 1;
    let page = 1;
    let skip = 0;

    if (query?.limit) {
        limit = Number(query?.limit)
    }

    if (query?.page) {
        page = Number(query.page);
        skip = (page - 1) * limit;
    }

    const paginateQuery = sortQuery.skip(skip);

    const limitQuery = paginateQuery.limit(limit);

    // fields limiting
    let fields = '-__v';
    if (query?.fields) {
        fields = (query.fields as string).split(',').join(' ');
    }

    const fieldQuery = await limitQuery.select(fields);
    return fieldQuery;
}

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id }).populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty'
        }
    });
    return result;
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {};

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, { new: true, runValidators: true });
    return result;
}

const deleteStudentFromDB = async (id: string) => {
    const session = await startSession();

    try {
        session.startTransaction();

        const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Faild to deleted student');
        }

        const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Faild to deleted user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
}

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB
}