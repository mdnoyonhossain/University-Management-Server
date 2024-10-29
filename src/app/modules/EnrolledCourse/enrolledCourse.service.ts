import { TOfferedCourse } from "../offeredCourse/offeredCourse.interface"

const createEnrolledCourseIntoDB = async (userId: string, payload: TOfferedCourse) => {
    console.log(userId, payload);
}

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB
}