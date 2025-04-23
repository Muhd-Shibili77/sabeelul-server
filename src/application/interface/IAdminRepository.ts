import Student from "../../domain/entites/Student";
import Teacher from "../../domain/entites/Teacher";
import Class from "../../domain/entites/Class";
import Program from "../../domain/entites/Program";

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
    addClass(classData: Class): Promise<Class>;
    editClass(id: string, classData: Class): Promise<Class>;
    deleteClass(id: string): Promise<void>;
    findClassById(id:string):Promise<Class | null> ;
    fetchClasses(query:object,page?:number,limit?:number): Promise<{classes: Class[], totalPages?: number}>;
    addProgram(program: Program): Promise<Program>;
    editProgram(id: string, program: Program): Promise<Program>;
    deleteProgram(id: string): Promise<void>;
    findProgramById(id: string): Promise<Program | null>;
    fetchPrograms(query: object, page?: number, limit?: number): Promise<{ programs: Program[]; totalPages?: number }>;
}