import { IStudentRepository } from "../interface/IStudentRepository";
import { ITeacherRepository } from "../interface/ITeacherRepository";
import { IClassRepository } from "../interface/IClassRepository";
export class AdminUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private classRepository: IClassRepository
  ) {}

  async getDashboard(){
    const totalStudents = await this.studentRepository.countStudent()
    const totalTeachers = await this.teacherRepository.countTeacher()
    const performerInClass = await this.studentRepository.bestPerfomerClass()
    const bestPerfomerClass = await this.studentRepository.getBestPerformingClass()
    
  }

}
