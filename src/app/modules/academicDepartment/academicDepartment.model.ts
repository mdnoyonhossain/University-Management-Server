import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartment = new Schema<TAcademicDepartment>({
    name: { type: String, required: true, unique: true },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: "AcademicFaculty"
    }
}, { timestamps: true });

academicDepartment.pre('save', async function (next) {
    const isDepartmentExists = await AcademicDepartment.findOne({ name: this.name });
    if (isDepartmentExists) {
        throw new Error("This Department is Already Exists!");
    }

    next();
});

academicDepartment.pre("findOneAndUpdate", async function (next) {
    const query = this.getQuery();
    const isDepartmentExists = await AcademicDepartment.findOne(query);
    if (!isDepartmentExists) {
        throw new Error("This Department Does not Exists!");
    }

    next();
})

export const AcademicDepartment = model<TAcademicDepartment>("AcademicDepartment", academicDepartment);