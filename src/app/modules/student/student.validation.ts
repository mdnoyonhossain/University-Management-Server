import { z } from 'zod';

const createUserNameValidationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string()
});

const createGuardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string()
});

const createLocalGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string()
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        student: z.object({
            name: createUserNameValidationSchema,
            gender: z.enum(['male', 'female', 'other']),
            dateOfBirth: z.string(),
            email: z.string().email("Invalid email address"),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            BloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
                errorMap: () => ({ message: "Invalid blood group" })
            }),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            profileImg: z.string().optional(),
        })
    })
});

export const StudentValidations = {
    createStudentValidationSchema
} 
