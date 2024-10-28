import { z } from 'zod';

const userValidationSchema = z.object({
    pasword: z.string({ invalid_type_error: 'Password must be string' }).max(20, { message: 'Password can not be more than 20 characters' }).optional(),
});

const userChangeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(['in-progress', 'blocked'])
    })
})

export const UserValidation = {
    userValidationSchema,
    userChangeStatusValidationSchema
};