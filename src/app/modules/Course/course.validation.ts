import { z } from "zod";

const PreRequisiteCoursesValidationSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
});

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number().int().min(1, "Code must be a positive integer"),
        credits: z.number().int().min(1, "Credits must be a positive integer"),
        preRequisiteCourses: z.array(PreRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
});

const updatePreRequisiteCoursesValidationSchema = z.object({
    course: z.string().optional(),
    isDeleted: z.boolean().optional()
});

const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().int().min(1, "Code must be a positive integer").optional(),
        credits: z.number().int().min(1, "Credits must be a positive integer").optional(),
        preRequisiteCourses: z.array(updatePreRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
});

const facultiesWithCourseValidationSchema = z.object({
    body: z.object({
        faculties: z.array(z.string()),
    }),
});

export const CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    facultiesWithCourseValidationSchema
}