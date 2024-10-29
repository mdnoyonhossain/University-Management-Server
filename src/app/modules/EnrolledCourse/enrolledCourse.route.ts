import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseController } from "./enrolledCourse.controller";

const router = express.Router();

router.post(
    '/create-enrolled-course',
    validateRequest(EnrolledCourseValidations.createEnrolledCourseValidationSchema),
    EnrolledCourseController.createEnrolledCourse
);

export const EnrolledCourseRoutes = router;