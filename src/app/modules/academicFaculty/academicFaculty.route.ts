import express from "express";
import { AcademicFacultyController } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    '/create-academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicFacultyValidations.createAcademicFacultyValidationSchema),
    AcademicFacultyController.createAcademicFaculty
);

router.get('/', AcademicFacultyController.getAllAcademicFaculties);

router.get('/:facultyId', AcademicFacultyController.getSingleAcademicFaculty);

router.patch(
    '/:facultyId',
    validateRequest(AcademicFacultyValidations.updateAcademicFacultyValidationSchema),
    AcademicFacultyController.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;