import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Student } from "../student/student.model";
import { startSession } from "mongoose";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    const isOfferedCourseExists = await OfferedCourse.findById(payload?.offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "The course has reached its maximum capacity. Enrollment is no longer available.");
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student Not Found!");
    }

    const isStudnetAlreadyExists = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse: payload?.offeredCourse,
        student: student._id
    });
    if (isStudnetAlreadyExists) {
        throw new AppError(httpStatus.CONFLICT, "Student is Already Exists!");
    }

    const session = await startSession();

    try {
        session.startTransaction();

        const result = await EnrolledCourse.create([{
            semesterRegistration: isOfferedCourseExists.semesterRegistration,
            academicSemester: isOfferedCourseExists.academicSemester,
            academicFaculty: isOfferedCourseExists.academicFaculty,
            academicDepartment: isOfferedCourseExists.academicDepartment,
            offeredCourse: payload.offeredCourse,
            course: isOfferedCourseExists.course,
            student: student._id,
            faculty: isOfferedCourseExists.faculty,
            isEnrolled: true,
        }], { session });

        if (!result) {
            throw new AppError(httpStatus.BAD_REQUEST, "Faild To Enrolle This Course");
        }

        await OfferedCourse.findByIdAndUpdate(payload?.offeredCourse, {
            maxCapacity: isOfferedCourseExists.maxCapacity - 1
        });

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
}