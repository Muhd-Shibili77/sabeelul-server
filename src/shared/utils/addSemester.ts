import SemesterModel from "../../infrastructure/models/SemesterModel";

export const addSemester = async (semesterName:string)=>{
    await SemesterModel.create({ semester: semesterName });
}