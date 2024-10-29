import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Student } from "../student/student.model";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    const isOfferedCourseExists = await OfferedCourse.findById(payload?.offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "The course has reached its maximum capacity. Enrollment is no longer available.");
    }

    const student = await Student.findOne({ id: userId }).select('id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, "Student Not Found!");
    }

    const isStudnetAlreadyExists = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        offeredCourse: payload?.offeredCourse,
        student: student._id
    });
    if (!isStudnetAlreadyExists) {
        throw new AppError(httpStatus.CONFLICT, "Student is Already Exists!");
    }


}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
}