import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { UserValidation } from "./user.validation";

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student } = req.body;
        const result = await UserServices.createStudentIntoDB(password, student)

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const UserController = {
    createStudent
}