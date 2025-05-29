import path from "path";
import fs from 'fs'
import Class from "../../domain/entites/Class";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { IClassRepository } from "../interface/IClassRepository";

export class ClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async fetchClasses(query: object = {}, page?: number, limit?: number) {
    return await this.classRepository.fetchClasses(query, page, limit);
  }
  async addClass(
    name: string,
    icon: string,
    subjects: string[]
  ): Promise<Class> {
    if (!name) {
      throw new Error("All required fields must be filled.");
    }
    if (!icon) {
      throw new Error("Image is required");
    }
    const existClass = await this.classRepository.findClassByName(name);
    if (existClass) {
      throw new Error("class is already exist");
    }
    const cls = new Class({
      name: name,
      icon: icon,
      subjects: subjects,
    });
    const newClass = await this.classRepository.addClass(cls);
    return newClass;
  }
  async updateClass(id: string, name: string, icon?: string) {
  if (!id) {
    throw new Error("Id is required");
  }
  if (!name) {
    throw new Error("All required fields must be filled.");
  }

  const existClass = await this.classRepository.findClassById(id);
  if (!existClass) {
    throw new Error("Class is not found");
  }
  
  // Delete old icon if new one is provided and different from existing
  if (icon && existClass.icon && icon !== existClass.icon) {
    try {
      const iconFileName = existClass.icon.split('/').pop();
      
      // Correctly build the path to src/uploads directory
      const oldIconPath = path.join(process.cwd(), 'src', existClass.icon);
      
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath);
      } else {
        const altPath = path.join(process.cwd(), 'src', 'uploads', 'classIcons', iconFileName!);
        
        if (fs.existsSync(altPath)) {
          fs.unlinkSync(altPath);
        } else {
          console.warn(`Old icon file not found at either path: ${oldIconPath} or ${altPath}`);
        }
      }
    } catch (error: any) {
      console.error(`Error deleting old icon file: ${error.message}`);
      // You might want to just log this error instead of throwing,
      // to prevent blocking the update if file deletion fails
    }
  }

  const iconToUse = icon || existClass.icon;
  const cls = new Class({
    name: name,
    icon: iconToUse,
  });
  const updateClass = await this.classRepository.editClass(id, cls);
  return updateClass;
}
  async deleteClass(id: string): Promise<void> {
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const students = await this.classRepository.findStudentInClass(id);

    if (students.length > 0) {
      throw new Error(
        "Cannot delete class: Please remove all assigned students before deleting the class."
      );
    }
    await this.classRepository.deleteClass(id);
  }
  async addScore(id: string, item: string, score: number,description:string): Promise<Class> {
    const academicYear = getCurrentAcademicYear();
    
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updatedClass = await this.classRepository.addScore(
      id,
      academicYear,
      item,
      score,
      description
    );
    return updatedClass;
  }
  async editScore(
    id: string,
    markId: string,
    item: string,
    description: string,
    score: number
  ): Promise<Class> {
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    
    const updatedClass = await this.classRepository.editScore(
      id,
      markId,
      item,
      score,
      description,
    );
    return updatedClass;
  }
  async deleteScore(classId: string, markId: string): Promise<void> {
    const cls = await this.classRepository.findClassById(classId);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updatedClass = await this.classRepository.deleteScore(
      classId,
      markId
    );
    return updatedClass;
  }
  async fetchClass(id: string): Promise<Class> {
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    return cls;
  }

  async addSubject(id: string, subject: string) {
    const cls = await this.classRepository.addSubject(id, subject);
    return cls;
  }
  async deleteSubject(id: string, subject: string) {
    const cls = await this.classRepository.deleteSubject(id, subject);
    return cls;
  }
  async addPenaltyScore(id:string,reason:string,penaltyScore:number,description:string):Promise<Class>{
    const academicYear = getCurrentAcademicYear();
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updateClass = await this.classRepository.addPenaltyScore(id,academicYear,reason,penaltyScore,description)
    return updateClass
  }
  async editPenaltyScore(id:string,markId:string,reason:string,penaltyScore:number,description:string):Promise<Class>{
    const cls = await this.classRepository.findClassById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updateClass = await this.classRepository.editPenaltyScore(id,markId,reason,penaltyScore,description)
    return updateClass
  }
  async deletePenaltyScore(classId: string, markId: string):Promise<void>{
    const cls = await this.classRepository.findClassById(classId);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updatedClass = await this.classRepository.deletePenaltyScore(classId,markId)
    return updatedClass
  }
  
}
