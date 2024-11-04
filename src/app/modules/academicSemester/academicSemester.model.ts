import { model, Schema } from "mongoose";
import { TAcademicSemester, TMonth } from "./academicSemester.interface";
import { MonthEnum } from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: { type: String, enum: ["Autumn", "Summer", "Fall"], required: true },
    code: { type: String, enum: ["01", "02", "03"], required: true },
    year: { type: String, required: true },
    startMonth: { type: String, enum: MonthEnum, required: true },
    endMonth: { type: String, enum: MonthEnum, required: true }
}, { timestamps: true });

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({name: this.name, year: this.year});
    if(isSemesterExists){
        throw new Error("Semester is already Exists!");
    }
    
    next();
})

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema);