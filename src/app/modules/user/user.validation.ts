import { z } from "zod";

const userValidationSchema = z.object({
    password: z.string().max(20, "Password can't be more than 20 characters").optional(),
});

export const UserValidations = {
    userValidationSchema
}