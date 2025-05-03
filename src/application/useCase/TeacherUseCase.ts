
import Teacher from "../../domain/entites/Teacher";
import { ITeacherRepository } from "../interface/ITeacherRepository";
import bcrypt from "bcrypt";
import validator from 'validator';

export class TeacherUseCase{
    constructor(private teacherRepository: ITeacherRepository) {}

    async fetchTeachers(query:object,page:number,limit:number) {
        const teachers = await this.teacherRepository.fetchTeachers(query,page,limit);
        return teachers
    }
    
    async addTeacher(name:string,phone:number,address:string, email:string, password:string, registerNumber:string,profile:string): Promise<Teacher> {
       
        if (!name) {
            throw new Error('Name is required.');
        }
        
        if (!email) {
            throw new Error('Email is required.');
        }
        
        if (!password) {
            throw new Error('Password is required.');
        }
        
        if (!registerNumber) {
            throw new Error('Register number is required.');
        }
        
        if (!address) {
            throw new Error('Address is required.');
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
       
        const newTeacher = await this.teacherRepository.addTeacher(teacher);
        return newTeacher
    }

   

    async deleteTeacher(id:string): Promise<void> {
        const teacher = await this.teacherRepository.findTeacherById(id);
        if (!teacher) {
            throw new Error('Teacher not found.');
        }
        if(teacher.isDeleted){
            throw new Error('Teacher already deleted.');
        }
        await this.teacherRepository.deleteTeacher(id);
    }

   
    async updateTeacher(id:string, name:string, phone:number, address:string, email:string, password:string, registerNumber:string,profile:string): Promise<Teacher> {
        if (!name) {
            throw new Error('Name is required.');
          }
          
          if (!email) {
            throw new Error('Email is required.');
          }
          
          if (!registerNumber) {
            throw new Error('Register number is required.');
          }
          
          if (!address) {
            throw new Error('Address is required.');
          }
          
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format.');
        }
        const phoneStr = phone.toString();
        if (!/^[0-9]{10}$/.test(phoneStr)) {
            throw new Error('Phone number must be exactly 10 digits.');
        }
        if (password != '' && password.length < 5) {
            throw new Error('Password must be at least 5 characters long.');
        }

        const existTeacher = await this.teacherRepository.findTeacherById(id)
        let hashedPassword = existTeacher?.password
        if(password !=''){
             hashedPassword = await bcrypt.hash(password, 10);
        }
        const teacher = new Teacher({
            registerNo:registerNumber,
            name,
            phone,
            address,
            email,
            password:hashedPassword,
            profileImage:profile
        });
       
        const updatedTeacher = await this.teacherRepository.updateTeacher(id, teacher);
        return updatedTeacher
    }

    async fetchProfile(id:string):Promise<Teacher>{
        if(!id){
            throw new Error('Id is required')
        }

        const teacher = await this.teacherRepository.fetchProfile(id)

        return teacher

    }

    

    

    

    
}