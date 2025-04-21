import { IAdminRepository } from "../../application/interface/IAdminRepository";
import Student from "../../domain/entites/Student";
import Teacher from "../../domain/entites/Teacher";
import StudentModel from "../models/StudentModel";
import TeacherModel from "../models/TeacherModel";

export class AdminRepository implements IAdminRepository{
    async fetchTeachers(query:object,page:number,limit:number): Promise<{teachers: Teacher[], totalPages: number}> {

        const count = await TeacherModel.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        const teachers = await TeacherModel.find(query).skip((page - 1) * limit).limit(limit).sort({registerNo:1});
        return{
            teachers:teachers.map((teacher) => new Teacher(teacher.toObject() as Teacher)),
            totalPages:totalPages,
        } 
    }
    async fetchStudents(query:object,page:number,limit:number): Promise<{students: Student[], totalPages: number}> {
        const count = await StudentModel.countDocuments(query);
        const totalPages = Math.ceil(count / limit);
        const students = await StudentModel.find(query).skip((page - 1) * limit).limit(limit).sort({admissionNo:1});
        return {
            students:students.map((student) => new Student(student.toObject() as Student)),
            totalPages:totalPages,
        }
    }

    async addTeacher(teacher: Teacher): Promise<Teacher> {
        const newTeacher = new TeacherModel(teacher);
        await newTeacher.save();
        return new Teacher(newTeacher.toObject() as Teacher);
    }
    async addStudent(student: Student): Promise<Student> {
        const newStudent = new StudentModel(student);
        await newStudent.save();
        return new Student(newStudent.toObject() as Student);
    }
    async deleteTeacher(id: string): Promise<void> {
        await TeacherModel.findByIdAndUpdate(id, { isDeleted: true });
    }
    async deleteStudent(id: string): Promise<void> {
        await StudentModel.findByIdAndUpdate(id, { isDeleted: true });
    }
    async findTeacherById(id: string): Promise<Teacher | null> {
        const teacher = await TeacherModel.findById(id);
        if (!teacher) {
            return null;
        }
        return new Teacher(teacher.toObject() as Teacher); 
    }
    async findStudentById(id: string): Promise<Student | null> {
        const student = await StudentModel.findById(id);
        if (!student) {
            return null;
        }
        return new Student(student.toObject() as Student);
    }
    async updateTeacher(id: string, teacher: Teacher): Promise<Teacher> {
        const updatedTeacher = await TeacherModel.findByIdAndUpdate(id, teacher, { new: true });
        if (!updatedTeacher) {
            throw new Error("Teacher not found");
        }
        return new Teacher(updatedTeacher.toObject() as Teacher);
    }
    async updateStudent(id: string, student: Student): Promise<Student> {
        const updatedStudent = await StudentModel.findByIdAndUpdate(id, student, { new: true });
        if (!updatedStudent) {
            throw new Error("Student not found");
        }
        return new Student(updatedStudent.toObject() as Student);
    } 

}