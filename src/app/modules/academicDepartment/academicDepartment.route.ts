import express from "express";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidation),
    AcademicDepartmentController.createAcademicDepartment
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartment);

router.get('/:departmentId', AcademicDepartmentController.getSingleAcademicDepartment);

router.patch(
    '/:departmentId',
    validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentValidation),
    AcademicDepartmentController.updateAcademicDepartment
);

export const AcademicDepartmentRoutes = router;