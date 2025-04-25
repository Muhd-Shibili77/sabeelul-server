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
    async fetchStudents(query:object,page:number,limit:number) {
        const students = await this.adminRepository.fetchStudents(query,page,limit);
        return students
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

    async addStudent(admissionNo:string,name:string,phone:number, email:string, password:string,className:string,address:string,guardianName:string,profile:string ): Promise<Student> {
        if (!name || !email || !password || !admissionNo || !address ||!phone || !guardianName || !className) {
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
        const student = new Student({
            admissionNo:admissionNo,
            name,
            phone,
            address,
            email,
            password:hashedPassword,
            classId:className,
            guardianName,
            profileImage:profile
        });
       
        const newStudent = await this.adminRepository.addStudent(student);
        return newStudent
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

    async deleteStudent(id:string): Promise<void> {
        const student = await this.adminRepository.findStudentById(id);
        if (!student) {
            throw new Error('Student not found.');
        }
        if(student.isDeleted){
            throw new Error('Student already deleted.');
        }
        await this.adminRepository.deleteStudent(id);
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

    async updateStudent(id:string, admissionNo:string,name:string,phone:number, email:string, password:string,className:string,address:string,guardianName:string,profile:string ): Promise<Student> {
        if (!name || !email || !password || !admissionNo || !address ||!phone || !guardianName || !className) {
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
        const student = new Student({
            admissionNo:admissionNo,
            name,
            phone,
            address,
            email,
            password:hashedPassword,
            classId:className,
            guardianName,
            profileImage:profile
        });
       
        const updatedStudent = await this.adminRepository.updateStudent(id, student);
        return updatedStudent
    }

    

    

    
}