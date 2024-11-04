import { z } from "zod";
import { MonthEnum } from "./academicSemester.constant";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum(["Autumn", "Summer", "Fall"]),
        code: z.enum(["01", "02", "03"]),
        year: z.string(),
        startMonth: z.enum([...MonthEnum] as [string, ...string[]]),
        endMonth: z.enum([...MonthEnum] as [string, ...string[]])
    })
});

const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum(["Autumn", "Summer", "Fall"]).optional(),
        code: z.enum(["01", "02", "03"]).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...MonthEnum] as [string, ...string[]]).optional(),
        endMonth: z.enum([...MonthEnum] as [string, ...string[]]).optional()
    })
});

export const AcademicSemesterValidations = {
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
}