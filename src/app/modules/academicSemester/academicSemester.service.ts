import { TAcademicSemester, TAcademicSemesterCodeNameMapper } from "./academicSemester.interface"
import { AcademicSemester } from "./academicSemester.model"

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    const academicSemesterCodeNameMapper: TAcademicSemesterCodeNameMapper = {
        Autumn: "01",
        Summar: "02",
        Fall: "03"
    }

    if (academicSemesterCodeNameMapper[payload.name] !== payload.code) {
        throw new Error("Invalid Semester Code");
    }

    const result = await AcademicSemester.create(payload);
    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
}