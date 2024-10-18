import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty } = payload;

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

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB
}