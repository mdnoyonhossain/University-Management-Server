import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseController } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validateRequest(EnrolledCourseValidations.createEnrolledCourseValidationSchema),
    EnrolledCourseController.createEnrolledCourse
);

export const EnrolledCourseRoutes = router;