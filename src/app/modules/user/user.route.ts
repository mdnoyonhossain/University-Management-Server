import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';
import { facultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
    '/create-admin',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    upload.single('file'),
    (req, res, next) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);


router.post(
    '/create-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    upload.single('file'),
    (req, res, next) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(facultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    '/create-student',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    upload.single('file'),
    (req, res, next) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.get(
    '/me',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    UserControllers.getMe
);

router.post(
    '/change-status/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(UserValidation.userChangeStatusValidationSchema),
    UserControllers.userChangeStatus
);

export const UserRoutes = router;