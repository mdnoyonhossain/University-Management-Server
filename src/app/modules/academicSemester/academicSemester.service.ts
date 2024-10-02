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

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();
    return result;
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById({ _id: id });
    return result;
}

const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    const result = await AcademicSemester.updateOne({ _id: id }, payload);
    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB
}