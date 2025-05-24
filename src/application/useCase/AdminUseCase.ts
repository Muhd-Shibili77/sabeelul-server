import { IStudentRepository } from "../interface/IStudentRepository";
import { ITeacherRepository } from "../interface/ITeacherRepository";
import { IExtraMarkItemRepository } from "../interface/IExtraMarkItemRepository";
import { IThemeRepository } from "../interface/IThemeRepository";
export class AdminUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private themeRepository: IThemeRepository,
    private extraMarkItemRepository: IExtraMarkItemRepository
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

  async getExtraMarkItem(){
    const extraMarkItem = await this.extraMarkItemRepository.getItems()
    return extraMarkItem
  }

  async addExtraMarkItem(item:string,description:string){
    if(!item){
      throw new Error("Item name is required");
    }
    if(!description){
      throw new Error("Item description is required");
    }

    const extraMarkItem = await this.extraMarkItemRepository.addItem(item,description)
    return extraMarkItem
  }

  async updateExtraMarkItem(id:string,item:string,description:string){
    if(!id){
      throw new Error("Item ID is required");
    }
    if(!item){
      throw new Error("Item name is required");
    }
    if(!description){
      throw new Error("Item description is required");
    }
    const existingItem = await this.extraMarkItemRepository.getItemById(id);
    if(!existingItem){
      throw new Error("Item not found");
    }
    if(existingItem.isDeleted){
      throw new Error("Item is deleted");
    }

    const extraMarkItem = await this.extraMarkItemRepository.updateItem(id,item,description)
    return extraMarkItem
  }

  async deleteExtraMarkItem(id:string){
    const extraMarkItem = await this.extraMarkItemRepository.deleteItem(id)
    return extraMarkItem
  }

}
