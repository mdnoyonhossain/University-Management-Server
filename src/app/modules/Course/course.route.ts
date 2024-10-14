import express from "express";
import { CourseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";

const router = express.Router();

router.post(
    '/create-course',
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseController.createCourse
);

router.get('/', CourseController.getAllCourses);

router.get('/:id', CourseController.getSingleCourse);

router.patch(
    '/:id',
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseController.updateCourse
);

router.delete('/:id', CourseController.deleteCourse);

export const CourseRoutes = router;