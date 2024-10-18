import express from "express";
import { OfferedCourseController } from "./offeredCourse.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";

const router = express.Router();

router.post(
    '/create-offered-course',
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseController.createOfferedCourse
);

export const OfferedCourseRoutes = router;