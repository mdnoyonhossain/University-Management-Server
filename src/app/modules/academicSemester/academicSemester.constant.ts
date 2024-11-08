import { TAcademicSemesterCodeNameMapper, TMonth } from "./academicSemester.interface";

export const MonthEnum: TMonth[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const academicSemesterCodeNameMapper: TAcademicSemesterCodeNameMapper = {
    Autumn: "01",
    Summer: "02",
    Fall: "03"
}

export const AcademicSemesterSearchableFields = ['name', 'year'];