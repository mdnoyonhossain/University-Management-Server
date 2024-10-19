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

router.get('/', OfferedCourseController.getAllOfferedCourse);

router.get('/:id', OfferedCourseController.getSingleOfferedCourse);

router.patch(
    '/:id',
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseController.updateOfferedCourse
);

router.delete('/:id', OfferedCourseController.deleteSemesterRegistrationWithOfferedCourses);

export const OfferedCourseRoutes = router;