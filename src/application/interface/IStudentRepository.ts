import Class from "../../domain/entites/Class";
import Student from "../../domain/entites/Student";
import { ClassPerformance } from "../../domain/types/classPerfromance";
export interface IStudentRepository{
    fetchStudents(query:object,page:number,limit:number): Promise<{students: Student[], totalPages: number}>;
    addStudent(student: Student): Promise<Student>;
    deleteStudent(id: string): Promise<void>;
    findStudentById(id: string): Promise<Student | null>;
    updateStudent(id: string, student: Student): Promise<Student>;
    findByAdNo(admissionNo:string):Promise<Student | null>
    addExtraScore(id:string,academicYear:string,programName:string,mark:number):Promise<Student>
    deleteExtraScore(id:string):Promise<null>
    editExtraScore(id:string,mark:number):Promise<void>
    addMentorScore(id:string,academicYear:string,mark:number):Promise<Student>
    addCceScore(id:string,academicYear:string,classId:string,subjectName:string,phase:string,mark:number):Promise<Student>
    fetchProfile(id:string):Promise<Student>
    countStudent():Promise<number>;
    bestPerfomerClass():Promise<Student[]>
    getBestPerformingClass():Promise<ClassPerformance[]>
    findByClass(classId:string):Promise<Student[]>
    bestPerformerOverall(): Promise<Student[]>
    getTopStudentsInClass(classId: string): Promise<Student[]>
    isExist(data:string):Promise<boolean>
    getTopClass():Promise<{ className: string; totalScore: number }[]>
}