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

const getMyOfferedCoursesFromDB = async (userId: string, query: Record<string, unknown>) => {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }

    const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({ status: 'ONGOING' });
    if (!currentOngoingRegistrationSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'There is no ongoing semester registration!');
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$semesterRegistration', '$$currentOngoingRegistrationSemester'],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },

                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            },
        },
    ];

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id).populate('academicDepartment academicFaculty academicSemester course faculty semesterRegistration');
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
    getMyOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteSemesterRegistrationWithOfferedCoursesIntoDB
}