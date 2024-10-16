import httpStatus, { REQUEST_URI_TOO_LONG } from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({ $or: [{ status: "UPCOMING" }, { status: "ONGOING" }] });
    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester?.status} Registered Semester!`);
    }

    const isAcademicSemesterExists = await AcademicSemester.findById(payload?.academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This Academic Semester is Not Found!");
    }

    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester: payload?.academicSemester });
    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, "This Semester is already registered!");
    }

    const result = await SemesterRegistration.create(payload);
    return result;
}

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = await new QueryBuilder(SemesterRegistration.find().populate("academicSemester"), query).filter().sort().paginate().fields();
    const result = await semesterRegistrationQuery.modelQuery;
    return result;
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate("academicSemester");
    return result;
}

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
    if(!isSemesterRegistrationExists){
        throw new AppError(httpStatus.NOT_FOUND, "This Semester is not found!");
    }
    
    if (isSemesterRegistrationExists.status === "ENDED") {
        throw new AppError(httpStatus.BAD_REQUEST, `This Semester is already ${isSemesterRegistrationExists.status}`);
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
}