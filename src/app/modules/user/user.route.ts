import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';
import { facultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
    '/create-admin',
    // auth(USER_ROLE.admin),
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);


router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.get(
    '/me',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    UserControllers.getMe
);

export const UserRoutes = router;