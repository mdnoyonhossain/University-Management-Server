import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './faculty.controller';
import { facultyValidations } from './faculty.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), FacultyControllers.getAllFaculties);

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
    '/:id',
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFaculty
);

router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;