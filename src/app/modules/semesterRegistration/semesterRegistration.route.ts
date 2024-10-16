import express from "express";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";

const router = express.Router();

router.post(
    '/create-semester-registration',
    validateRequest(SemesterRegistrationValidations.createSemesterRegistrationValidationSchema),
    SemesterRegistrationController.createSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.get('/:id', SemesterRegistrationController.getSingleSemesterRegistration);

router.patch(
    '/:id',
    validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema),
    SemesterRegistrationController.updateSemesterRegistration
);

export const SemesterRegistrationRoutes = router;