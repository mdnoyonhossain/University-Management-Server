import { z } from "zod";

const createAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({ invalid_type_error: "Academic Department Name is Required", required_error: "Name is Required" }),
        academicFaculty: z.string({ invalid_type_error: "Academic Faculty ID is Required", required_error: "academicFaculty is Required" })
    })
});

const updateAcademicDepartmentValidation = z.object({
    body: z.object({
        name: z.string({ invalid_type_error: "Academic Department Name is Required", required_error: "Name is Required" }).optional(),
        academicFaculty: z.string({ invalid_type_error: "Academic Faculty ID is Required", required_error: "academicFaculty is Required" }).optional()
    })
});

export const AcademicDepartmentValidation = {
    createAcademicDepartmentValidation,
    updateAcademicDepartmentValidation
}