import Class from "../../domain/entites/Class";
import Program from "../../domain/entites/Program";
import Student from "../../domain/entites/Student";
import Teacher from "../../domain/entites/Teacher";
import { IAdminRepository } from "../interface/IAdminRepository";
import bcrypt from "bcrypt";
import validator from 'validator';

export class AdminUseCase{
    constructor(private adminRepository: IAdminRepository) {}

    async fetchTeachers(query:object,page:number,limit:number) {
        const teachers = await this.adminRepository.fetchTeachers(query,page,limit);
        return teachers
    }
    
    async addTeacher(name:string,phone:number,address:string, email:string, password:string, registerNumber:string,profile:string): Promise<Teacher> {
        if (!name || !email || !password || !registerNumber || !address) {
            throw new Error('All required fields must be filled.');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format.');
        }
        const phoneStr = phone.toString();
        if (!/^[0-9]{10}$/.test(phoneStr)) {
            throw new Error('Phone number must be exactly 10 digits.');
        }
        if (password.length < 5) {
            throw new Error('Password must be at least 5 characters long.');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new Teacher({
            registerNo:registerNumber,
            name,
            phone,
            address,
            email,
            password:hashedPassword,
            profileImage:profile
        });
       
        const newTeacher = await this.adminRepository.addTeacher(teacher);
        return newTeacher
    }

   

    async deleteTeacher(id:string): Promise<void> {
        const teacher = await this.adminRepository.findTeacherById(id);
        if (!teacher) {
            throw new Error('Teacher not found.');
        }
        if(teacher.isDeleted){
            throw new Error('Teacher already deleted.');
        }
        await this.adminRepository.deleteTeacher(id);
    }

   
    async updateTeacher(id:string, name:string, phone:number, address:string, email:string, password:string, registerNumber:string,profile:string): Promise<Teacher> {
        if (!name || !email || !password || !registerNumber || !address) {
            throw new Error('All required fields must be filled.');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format.');
        }
        const phoneStr = phone.toString();
        if (!/^[0-9]{10}$/.test(phoneStr)) {
            throw new Error('Phone number must be exactly 10 digits.');
        }
        if (password.length < 5) {
            throw new Error('Password must be at least 5 characters long.');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new Teacher({
            registerNo:registerNumber,
            name,
            phone,
            address,
            email,
            password:hashedPassword,
            profileImage:profile
        });
       
        const updatedTeacher = await this.adminRepository.updateTeacher(id, teacher);
        return updatedTeacher
    }

    

    

    

    
}