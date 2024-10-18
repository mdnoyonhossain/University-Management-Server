import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const toTimeDate = (time: string): Date => new Date(`1970-01-01T${time}:00`);

const timeStringSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format. Expected "HH:MM" in 24-hour format.' });

const createOfferedCourseValidationSchema = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        course: z.string(),
        faculty: z.string(),
        section: z.number().positive().int(),
        maxCapacity: z.number().positive().int(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    }).refine(
        (body) => toTimeDate(body.endTime) > toTimeDate(body.startTime),
        { message: 'Start time must be earlier than end time.' }
    ),
});

const updateOfferedCourseValidationSchema = z.object({
    body: z.object({
        faculty: z.string(),
        maxCapacity: z.number().positive().int(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    }).refine(
        (body) => toTimeDate(body.endTime) > toTimeDate(body.startTime),
        { message: 'Start time must be earlier than end time.' }
    ),
});

export const OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema,
};
