import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const course = req.body;
    const result = await CourseServices.createCourseIntoDB(course);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Course Created Successfully",
        data: result
    })
})

const getAllCourses = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await CourseServices.getAllCoursesFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course Retrived Successfully",
        data: result
    })
})

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course Retrived Successfully",
        data: result
    })
})

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course Deleted Successfully",
        data: result
    })
})

export const CourseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse
}