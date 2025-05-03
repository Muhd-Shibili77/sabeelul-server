import Program from "../../domain/entites/Program";
import Student from "../../domain/entites/Student";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
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
    if (!name) {
      throw new Error("Name is required.");
    }
    
    if (!email) {
      throw new Error("Email is required.");
    }
    
  
    if (!admissionNo) {
      throw new Error("Admission number is required.");
    }
    
    if (!address) {
      throw new Error("Address is required.");
    }
    
    if (!phone) {
      throw new Error("Phone number is required.");
    }
    
    if (!guardianName) {
      throw new Error("Guardian name is required.");
    }
    
    if (!className) {
      throw new Error("Class is required.");
    }
    
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    const phoneStr = phone.toString();
    if (!/^[0-9]{10}$/.test(phoneStr)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
    if (password != '' && password.length < 5) {
      throw new Error('Password must be at least 5 characters long.');
  }

    const existStudent = await this.studentRepository.findStudentById(id)
    let hashedPassword = existStudent?.password
    if(password !=''){
        hashedPassword = await bcrypt.hash(password, 10);
    }

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
  async fetchProfile(id:string){
     if(!id){
        throw new Error('id is required')
     }
     const student = await this.studentRepository.fetchProfile(id)
     if(student.isDeleted){
        throw new Error('student is deleted')
     }
     return student
  }


  async dashboard(id:string){
    
    if(!id){
      throw new Error('id is required')
    }
    const student = await this.studentRepository.fetchProfile(id)
    if(student.isDeleted){
      throw new Error('student is deleted')
    }
    const academicYear = getCurrentAcademicYear()

    // Filter extraMarks by academic year and find latest (assuming order is not guaranteed)
    const filteredExtraMarks = student.extraMarks
    ?.filter(e => e.academicYear === academicYear)
    .sort((a, b) => b.mark - a.mark); // sort by mark, or add timestamp if available

    const latestExtra = filteredExtraMarks?.[0];

    let latestAchievement = null;
    if (latestExtra) {
      if (latestExtra.programId && typeof latestExtra.programId === 'object') {
        latestAchievement = (latestExtra.programId as Program).name;
      } else if (latestExtra.customProgramName) {
        latestAchievement = latestExtra.customProgramName;
      }
    }

    let cceMarkTotal = 0;
    if (student.cceMarks?.length) {
      student.cceMarks
        .filter(cce => cce.academicYear === academicYear)
        .forEach(cce => {
          cce.subjects?.forEach(subject => {
            if (subject.mark) {
              cceMarkTotal += subject.mark * 0.2;
            }
          });
        });
    }

    const mentorMarkTotal = student.mentorMarks
    ?.filter(m => m.academicYear === academicYear)
    .reduce((sum, m) => sum + (m.mark || 0), 0) || 0;

  const extraMarkTotal = student.extraMarks
    ?.filter(e => e.academicYear === academicYear)
    .reduce((sum, e) => sum + (e.mark || 0), 0) || 0;

  const totalMarks = cceMarkTotal + mentorMarkTotal + extraMarkTotal;

    const details ={
      name:student.name,
      profileImage:student.profileImage,
      class:student.classId,
      marks: totalMarks,
      latestAchievement:latestAchievement,
    }

    return details

  }

  async performance(id:string){
    if(!id){
      throw new Error('id is required')
    }
    const student = await this.studentRepository.fetchProfile(id)
    if(student.isDeleted){
      throw new Error('student is deleted')
    }
    const academicYear = getCurrentAcademicYear()

    let cceMarkTotal = 0;
    if (student.cceMarks?.length) {
      student.cceMarks
        .filter(cce => cce.academicYear === academicYear)
        .forEach(cce => {
          cce.subjects?.forEach(subject => {
            if (subject.mark) {
              cceMarkTotal += subject.mark * 0.2;
            }
          });
        });
    }

    const mentorMarkTotal = student.mentorMarks
    ?.filter(m => m.academicYear === academicYear)
    .reduce((sum, m) => sum + (m.mark || 0), 0) || 0;

  const extraMarkTotal = student.extraMarks
    ?.filter(e => e.academicYear === academicYear)
    .reduce((sum, e) => sum + (e.mark || 0), 0) || 0;

  const totalMarks = cceMarkTotal + mentorMarkTotal + extraMarkTotal;


   // Filter and map all extraMarks in this academic year
const achievementDetails = student.extraMarks
?.filter(e => e.academicYear === academicYear)
.map(e => {
  let name: string | null = null;

  if (e.programId && typeof e.programId === 'object') {
    name = (e.programId as Program).name;
  } else if (e.customProgramName) {
    name = e.customProgramName;
  }

  return {
    name,
    mark: e.mark,
  };
}) || [];
  const details={
    totalScore:totalMarks,
    cceScore:cceMarkTotal,
    creditScore:extraMarkTotal,
    achievments:achievementDetails,
  }
  return details
  }

  async fetchByClass(classId:string){
      if(!classId){
        throw new Error('class id is required')
      }
      const students = await this.studentRepository.findByClass(classId)

      return students
  }
}
