import express from "express";
import { OfferedCourseController } from "./offeredCourse.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseController.createOfferedCourse
);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseController.getAllOfferedCourse
);

router.get(
    '/my-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseController.getMyOfferedCourse
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    OfferedCourseController.getSingleOfferedCourse
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseController.updateOfferedCourse
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseController.deleteSemesterRegistrationWithOfferedCourses
);

export const OfferedCourseRoutes = router;