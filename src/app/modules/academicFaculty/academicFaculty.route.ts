import express from "express";
import { AcademicFacultyController } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidations } from "./academicFaculty.validation";

const router = express.Router();

router.post(
    '/create-academic-faculty',
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