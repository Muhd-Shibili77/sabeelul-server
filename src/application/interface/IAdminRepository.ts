import Student from "../../domain/entites/Student";
import Teacher from "../../domain/entites/Teacher";

export interface IAdminRepository {
    fetchTeachers(query:object,page:number,limit:number): Promise<{teachers: Teacher[], totalPages: number}>;
    fetchStudents(query:object,page:number,limit:number): Promise<{students: Student[], totalPages: number}>;
    addTeacher(teacher: Teacher): Promise<Teacher>;
    addStudent(student: Student): Promise<Student>;
    deleteTeacher(id: string): Promise<void>;
    deleteStudent(id: string): Promise<void>;
    findTeacherById(id: string): Promise<Teacher | null>;
    findStudentById(id: string): Promise<Student | null>;
    updateTeacher(id: string, teacher: Teacher): Promise<Teacher>;
    updateStudent(id: string, student: Student): Promise<Student>;
}