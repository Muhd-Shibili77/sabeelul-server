
import Teacher from "../../domain/entites/Teacher";


export interface ITeacherRepository {
    fetchTeachers(query:object,page:number,limit:number): Promise<{teachers: Teacher[], totalPages: number}>;
    addTeacher(teacher: Teacher): Promise<Teacher>;
    deleteTeacher(id: string): Promise<void>;
    findTeacherById(id: string): Promise<Teacher | null>;
    updateTeacher(id: string, teacher: Teacher): Promise<Teacher>;
    
}