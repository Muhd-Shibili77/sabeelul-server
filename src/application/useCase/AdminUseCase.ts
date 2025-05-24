import { IStudentRepository } from "../interface/IStudentRepository";
import { ITeacherRepository } from "../interface/ITeacherRepository";
import { IClassRepository } from "../interface/IClassRepository";
import { IThemeRepository } from "../interface/IThemeRepository";
export class AdminUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private classRepository: IClassRepository,
    private themeRepository: IThemeRepository
  ) {}

  async getDashboard(){
    const totalStudents = await this.studentRepository.countStudent()
    const totalTeachers = await this.teacherRepository.countTeacher()
    const performerInClass = await this.studentRepository.bestPerfomerClass()
    const classAnalysis = await this.studentRepository.getBestPerformingClass();
    const bestPerformerClass = classAnalysis[0]; 
    return {totalStudents,totalTeachers,performerInClass,classAnalysis,bestPerformerClass}
        
  }
  async getTheme(){
    const theme = await this.themeRepository.getTheme()
    return theme
  }
  async updateTheme(id:string,minMark:number,maxMark:number){
    const theme = await this.themeRepository.updateTheme(id,minMark,maxMark)
    return theme
  }

}
