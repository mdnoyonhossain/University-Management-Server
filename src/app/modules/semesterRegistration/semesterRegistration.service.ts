import httpStatus, { REQUEST_URI_TOO_LONG } from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({ $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }] });
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
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This Semester is not found!");
    }

    const currentSemesterStatus = isSemesterRegistrationExists?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Semester is already ${currentSemesterStatus}`);
    }

    if (currentSemesterStatus === RegistrationStatus.UPCOMING && payload?.status === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can't directly change status from ${currentSemesterStatus} to ${payload.status}`)
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && payload?.status === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can't directly change status from ${currentSemesterStatus} to ${payload.status}`)
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result;
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB
}