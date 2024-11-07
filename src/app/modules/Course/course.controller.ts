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

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const course = req.body;
    const result = await CourseServices.updateCourseIntoDB(id, course);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course Updated Successfully",
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

const assingFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties assigned  succesfully',
        data: result,
    });
});

const getFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.getFacultiesWithCourseFromDB(courseId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties retrived  succesfully',
        data: result,
    });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.removeFacultiesFromCourseFromDB(courseId, faculties);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties removed  succesfully',
        data: result,
    });
});

export const CourseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    assingFacultiesWithCourse,
    getFacultiesWithCourse,
    removeFacultiesFromCourse
}