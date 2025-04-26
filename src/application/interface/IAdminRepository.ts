import Student from "../../domain/entites/Student";
import Teacher from "../../domain/entites/Teacher";
import Class from "../../domain/entites/Class";
import Program from "../../domain/entites/Program";

export interface IAdminRepository {
    fetchTeachers(query:object,page:number,limit:number): Promise<{teachers: Teacher[], totalPages: number}>;
    addTeacher(teacher: Teacher): Promise<Teacher>;
    deleteTeacher(id: string): Promise<void>;
    findTeacherById(id: string): Promise<Teacher | null>;
    updateTeacher(id: string, teacher: Teacher): Promise<Teacher>;
    
}