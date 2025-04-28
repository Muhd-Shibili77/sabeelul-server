import mongoose from "mongoose";
import { IStudentRepository } from "../../application/interface/IStudentRepository";
import Student from "../../domain/entites/Student";
import StudentModel from "../models/StudentModel";

export class StudentRepository implements IStudentRepository {
    
  async addStudent(student: Student): Promise<Student> {
    const newStudent = new StudentModel(student);
    await newStudent.save();
    return new Student(newStudent.toObject() as Student);
  }
  async updateStudent(id: string, student: Student): Promise<Student> {
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, student, {
      new: true,
    });
    if (!updatedStudent) {
      throw new Error("Student not found");
    }
    return new Student(updatedStudent.toObject() as Student);
  }
  async findStudentById(id: string): Promise<Student | null> {
    const student = await StudentModel.findById(id);
    if (!student) {
      return null;
    }
    return new Student(student.toObject() as Student);
  }
  async deleteStudent(id: string): Promise<void> {
    await StudentModel.findByIdAndUpdate(id, { isDeleted: true });
  }
  async fetchStudents(
    query: object,
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalPages: number }> {
    const count = await StudentModel.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const students = await StudentModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ admissionNo: 1 });
    return {
      students: students.map(
        (student) => new Student(student.toObject() as Student)
      ),
      totalPages: totalPages,
    };
  }
  async findByAdNo(admissionNo: string): Promise<Student | null > {
    const student = await StudentModel.findOne({admissionNo:admissionNo})
    if(!student){
       return null
    }
    return new Student(student.toObject() as Student); 
  }
  async addExtraScore(id: string,academicYear:string, programName: string, mark: number): Promise<Student> {
    const updateData: any = { academicYear,mark };
    if (mongoose.Types.ObjectId.isValid(programName)) {
      updateData.programId = programName;
    } else {
      updateData.customProgramName = programName;
    }

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      {
        $push: {
          extraMarks: updateData
        }
      },
      { new: true }
    );
      if(!updatedStudent){
        throw new Error('student add score failed')
      }
      return new Student(updatedStudent.toObject() as Student)
  }

  async addMentorScore(id: string, academicYear: string, mark: number): Promise<Student> {
      const student = await StudentModel.findById(id)
      if(!student){
        throw new Error('student not found')
      }
      const updatedStudent = await StudentModel.findByIdAndUpdate(
        id,
        {$push:{mentorMarks:{academicYear,mark}}},
        {new:true}
      )
      if(!updatedStudent){
        throw new Error('Adding mentor failed')
      }
      return new Student(updatedStudent.toObject() as Student)
  }
  async addCceScore(id: string, academicYear: string, className: string, subjectName: string,phase:string, mark: number): Promise<Student> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("Student not found");
     }
    const academicRecord = student.cceMarks?.find(record => record.academicYear === academicYear);

    if(academicRecord){
      academicRecord.subjects.push({
        subjectName,
        phase,
        mark
       });
    }else{
      student.cceMarks?.push({
        academicYear,
        className,
        subjects: [{
            subjectName,
            phase,
            mark
        }]
    });
    }
    await student.save();

    return new Student(student.toObject() as Student)


  }
}
