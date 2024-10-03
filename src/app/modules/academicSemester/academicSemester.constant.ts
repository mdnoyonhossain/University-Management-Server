import { TAcademicSemesterCodeNameMapper, TMonth } from "./academicSemester.interface";

export const MonthEnum: TMonth[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const academicSemesterCodeNameMapper: TAcademicSemesterCodeNameMapper = {
    Autumn: "01",
    Summar: "02",
    Fall: "03"
}