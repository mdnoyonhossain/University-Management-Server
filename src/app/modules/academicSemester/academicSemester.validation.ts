import { z } from "zod";
import { MonthEnum } from "./academicSemester.constant";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum(["Autumn", "Summar", "Fall"]),
        code: z.enum(["01", "02", "03"]),
        year: z.string(),
        startMonth: z.enum([...MonthEnum] as [string, ...string[]]),
        endMonth: z.enum([...MonthEnum] as [string, ...string[]])
    })
});

export const AcademicSemesterValidations = {
    createAcademicSemesterValidationSchema
}