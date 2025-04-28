import Student from "../../domain/entites/Student";
import { IStudentRepository } from "../interface/IStudentRepository";
import bcrypt from "bcrypt";
import validator from "validator";

export class StudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async fetchStudents(query: object, page: number, limit: number) {
    const students = await this.studentRepository.fetchStudents(
      query,
      page,
      limit
    );
    return students;
  }

  async addStudent(
    admissionNo: string,
    name: string,
    phone: number,
    email: string,
    password: string,
    className: string,
    address: string,
    guardianName: string,
    profile: string
  ): Promise<Student> {
    if (
      !name ||
      !email ||
      !password ||
      !admissionNo ||
      !address ||
      !phone ||
      !guardianName ||
      !className
    ) {
      throw new Error("All required fields must be filled.");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    const phoneStr = phone.toString();
    if (!/^[0-9]{10}$/.test(phoneStr)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
    if (password.length < 5) {
      throw new Error("Password must be at least 5 characters long.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      admissionNo: admissionNo,
      name,
      phone,
      address,
      email,
      password: hashedPassword,
      classId: className,
      guardianName,
      profileImage: profile,
    });

    const newStudent = await this.studentRepository.addStudent(student);
    return newStudent;
  }
  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentRepository.findStudentById(id);
    if (!student) {
      throw new Error("Student not found.");
    }
    if (student.isDeleted) {
      throw new Error("Student already deleted.");
    }
    await this.studentRepository.deleteStudent(id);
  }

  async updateStudent(
    id: string,
    admissionNo: string,
    name: string,
    phone: number,
    email: string,
    password: string,
    className: string,
    address: string,
    guardianName: string,
    profile: string
  ): Promise<Student> {
    if (
      !name ||
      !email ||
      !password ||
      !admissionNo ||
      !address ||
      !phone ||
      !guardianName ||
      !className
    ) {
      throw new Error("All required fields must be filled.");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    const phoneStr = phone.toString();
    if (!/^[0-9]{10}$/.test(phoneStr)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
    if (password.length < 5) {
      throw new Error("Password must be at least 5 characters long.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      admissionNo: admissionNo,
      name,
      phone,
      address,
      email,
      password: hashedPassword,
      classId: className,
      guardianName,
      profileImage: profile,
    });

    const updatedStudent = await this.studentRepository.updateStudent(
      id,
      student
    );
    return updatedStudent;
  }

  async findByAdmissinNo(admissionNo:string):Promise<Student>{
      if(!admissionNo){
        throw new Error('Admission No required')
      }

      const student = await this.studentRepository.findByAdNo(admissionNo)

      if(!student){
        throw new Error('student not found')
      }

      return student 
  }
  async addExtraScore(id:string,academicYear:string,programName:string,mark:number):Promise<Student>{
      if(!id){
        throw new Error('id is required')
      }
      if(!academicYear){
        throw new Error('academicYear is required')
      }
      if(!programName){
        throw new Error('programName is required')
      }
      if(!mark){
        throw new Error('mark is required')
      }
      if(mark <= 0){
        throw new Error('mark is must be greater than zero')
      }

      const student = await this.studentRepository.addExtraScore(id,academicYear,programName,mark)
      if(!student){
        throw new Error('score is not updated to student')
      }
      return student
  }

  async addMentorScore(id:string,academicYear:string,mark:number):Promise<Student>{
    if(!id){
      throw new Error('id is required')
    }
    if(!academicYear){
      throw new Error('academicYear is required')
    }
    if(!mark){
      throw new Error('mark is required')
    }
    if(mark <= 0){
      throw new Error('mark is must be greater than zero')
    }
    const student = await this.studentRepository.addMentorScore(id,academicYear,mark)
    if(!student){
      throw new Error('Adding mentor failed')
    }
    return student
  }

  async addCceScore(id:string,academicYear:string,className: string,phase:string, subjectName: string, mark: number):Promise<Student>{
    if(!id){
      throw new Error('id is required')
    }
    if(!academicYear){
      throw new Error('academicYear is required')
    }
    if(!className){
      throw new Error('className is required')
    }
    if(!subjectName){
      throw new Error('subjectName is required')
    }
    if(!phase){
      throw new Error('phase is required')
    }
    if(!mark){
      throw new Error('mark is required')
    }
    if(mark <= 0){
      throw new Error('mark is must be greater than zero')
    }

    const studentExist = await this.studentRepository.findStudentById(id)
    if(!studentExist){
      throw new Error('student not found')
    }
    const updatedStudent = await this.studentRepository.addCceScore(id,academicYear,className,phase,subjectName,mark)
    if(!updatedStudent){
      throw new Error('Failed to add CCE mark to student')
    }
    return updatedStudent
  }
}
