import { model, Schema } from "mongoose";
import { TGuardian, TLocalGuardian, TStudent, TUserName } from "./student.interface";

const userNameSchema = new Schema<TUserName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true }
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true }
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true }
});

const studentSchema = new Schema<TStudent>({
    id: { type: String },
    name: { type: userNameSchema, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    BloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String },
    isActive: { type: String, enum: ['active', 'blocked'], required: true }
});

export const Student = model<TStudent>('Student', studentSchema);