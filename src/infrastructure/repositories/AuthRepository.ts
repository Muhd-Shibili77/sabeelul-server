import { IAuthRepository } from "../../application/interface/IAuthRepository";
import Admin from "../../domain/entites/Admin";
import Teacher from "../../domain/entites/Teacher";
import Student from "../../domain/entites/Student";
import AdminModel from "../models/AdminModel";
import TeacherModel from "../models/TeacherModel";
import StudentModel from "../models/StudentModel";

export class AuthRepository implements IAuthRepository{
    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email});
        if (!admin) return null;
        return new Admin(admin.toObject() as Admin);
    }

    async findTeacher(login: string): Promise<Teacher | null> {
        let teacher;
        const isEmail = (login:string) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
        };
        if(isEmail(login)){
            teacher = await TeacherModel.findOne({ email: login });
        }else{
            teacher = await TeacherModel.findOne({ phone: login });
        }

        if(!teacher) return null;
        return new Teacher(teacher.toObject() as Teacher);          
    }
    async findStudent(login: string): Promise<Student | null> {
        let student;
        const isEmail = (login:string) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
        };
        if(isEmail(login)){
            student = await StudentModel.findOne({ email: login });
        }else{
            student = await StudentModel.findOne({ phone: login });
        }

        if(!student) return null;
        return new Student(student.toObject() as Student);
    }
}