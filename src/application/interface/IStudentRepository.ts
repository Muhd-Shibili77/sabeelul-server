import Class from "../../domain/entites/Class";
import Student from "../../domain/entites/Student";
import { ClassPerformance } from "../../domain/types/classPerfromance";
export interface IStudentRepository {
  fetchStudents(
    query: object,
    page: number,
    limit: number,
    isClassFiltered: boolean
  ): Promise<{ students: Student[]; totalPages: number }>;
  findByLevel(level: string, className?: string): Promise<Student[]>;
  addStudent(student: Student): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  findStudentById(id: string): Promise<Student | null>;
  updateStudent(id: string, student: Student): Promise<Student>;
  findByAdNo(admissionNo: string): Promise<Student | null>;
  addExtraScore(
    id: string,
    academicYear: string,
    programName: string,
    mark: number,
    discription: string
  ): Promise<{ student: Student; addedMark: any; finalProgramName: string }>;
  deleteExtraScore(id: string): Promise<Boolean>;
  editExtraScore(id: string, mark: number, description: string): Promise<void>;
  addPenaltyScore(
    id: string,
    academicYear: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<{ student: Student; addedMark: any }>;
  editPenaltyScore(
    id: string,
    markId: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Student>;
  deletePenaltyScore(classId: string, markId: string): Promise<void>;
  addMentorScore(
    id: string,
    academicYear: string,
    mark: number,
    semester: string
  ): Promise<{ student: Student; addedMark: any }>;
  addCceScore(
    id: string,
    academicYear: string,
    semester: string,
    classId: string,
    subjectName: string,
    phase: string,
    mark: number
  ): Promise<{ student: Student; addedMark: any }>;
  fetchProfile(id: string): Promise<Student>;
  countStudent(): Promise<number>;
  bestPerfomerClass(): Promise<Student[]>;
  getBestPerformingClass(): Promise<ClassPerformance[]>;
  findByClass(classId: string, top?: number): Promise<Student[]>;
  findAll(top?: number): Promise<Student[]>;
  bestPerformerOverall(): Promise<Student[]>;
  getTopStudentsInClass(classId: string): Promise<Student[]>;
  isExist(data: string): Promise<boolean>;
  getTopClass(): Promise<{ className: string; totalScore: number }[]>;
  calculateAvgMark(classId: string, semester: string, scoreType: string, academicYear: string): Promise<number>;
}
