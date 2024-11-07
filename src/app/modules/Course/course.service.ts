import { startSession } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await courseQuery.modelQuery;
    const meta = await courseQuery.countTotal();

    return {
        meta,
        result
    };
}

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await startSession();

    try {
        await session.startTransaction();

        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });
        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update course');
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletedPreRequisites = preRequisiteCourses.filter(element => element.course && element.isDeleted).map(el => el.course);
            const deletePreRequisitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } }
                },
                { new: true, runValidators: true, session }
            );
            if (!deletePreRequisitesCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Faild to delete preRequisite Course')
            }

            const newPreRequisites = preRequisiteCourses?.filter(element => element.course && !element.isDeleted);
            const addPreRequisitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: newPreRequisites } }
                },
                { new: true, runValidators: true, session }
            );
            if (!addPreRequisitesCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Faild to add preRequisite Course')
            }
        }

        await session.commitTransaction();
        await session.endSession();

        const result = await Course.findById(id).populate('preRequisiteCourses.course')
        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Faild to update course');
    }
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};

const getFacultiesWithCourseFromDB = async (id: string) => {
    const result = await CourseFaculty.findOne({ course: id }).populate('faculties');
    return result;
}

const removeFacultiesFromCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } },
        },
        {
            new: true,
        },
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    getFacultiesWithCourseFromDB,
    removeFacultiesFromCourseFromDB
}