import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { startSession } from "mongoose";
import { Student } from "../student/student.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester Registration Not Found!");
    }

    const academicSemester = isSemesterRegistrationExists.academicSemester;

    const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty Not Found!");
    }

    const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic Department Not Found!");
    }

    const isCourseExists = await Course.findById(course);
    if (!isCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Course Not Found!");
    }

    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty Not Found!");
    }

    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({ _id: academicDepartment, academicFaculty });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`);
    }

    const isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection = await OfferedCourse.findOne({ semesterRegistration, course, section });
    if (isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, "Offered Course with same section is already exists!");
    }

    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at that time! Choose other time or day")
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
}

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = await new QueryBuilder(OfferedCourse.find(), query).filter().sort().paginate().fields();

    const result = await offeredCourseQuery.modelQuery;
    const meta = await offeredCourseQuery.countTotal();

    return {
        meta,
        result
    }
}

const getMyOfferedCourse = async (userId: string) => {
    const student = await Student.findOne({ id: userId });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
    }

    const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({ status: "ONGOING" });
    if (!currentOngoingRegistrationSemester) {
        throw new AppError(httpStatus.NOT_FOUND, "ONGOING registration semester not found");
    }

    const result = await OfferedCourse.aggregate([
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        }
    ]);

    return result;
}

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id);
    return result;
}

const updateOfferedCourseIntoDB = async (id: string, payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">) => {
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found!");
    }

    const isFacultyExists = await Faculty.findById(payload.faculty);
    if (!isFacultyExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);
    if (semesterRegistrationStatus?.status !== "UPCOMING") {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`);
    }

    const assignedSchedules = await OfferedCourse.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at that time! Choose other time or day")
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
}

const deleteSemesterRegistrationWithOfferedCoursesIntoDB = async (id: string) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const semesterRegistration = await SemesterRegistration.findById(id).select('status').session(session);
        if (!semesterRegistration) {
            throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
        }

        if (semesterRegistration?.status !== 'UPCOMING') {
            throw new AppError(httpStatus.BAD_REQUEST, `Cannot delete registration as it is not in ${semesterRegistration.status} status`);
        }

        await OfferedCourse.deleteMany({ semesterRegistration: id }).session(session);

        const result = await SemesterRegistration.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        return result;
    } catch (err: any) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(err);
    }
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCourseFromDB,
    getMyOfferedCourse,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteSemesterRegistrationWithOfferedCoursesIntoDB
}