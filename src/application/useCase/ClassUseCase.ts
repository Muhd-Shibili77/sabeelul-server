import Class from "../../domain/entites/Class";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { IClassRepository } from "../interface/IClassRepository";

export class ClassUseCase {
    constructor(private classRepository: IClassRepository) {}

    async fetchClasses(query: object = {}, page?: number, limit?: number) {
        return await this.classRepository.fetchClasses(query, page, limit);
    }
    async addClass(name:string,subjects:string[]):Promise<Class>{
        if(!name){
            throw new Error('All required fields must be filled.')
        }
        const existClass = await this.classRepository.findClassByName(name)
        if(existClass){
            throw new Error('class is already exist')
        }
        const cls = new Class({
            name:name,
            subjects:subjects
        })
        const newClass = await this.classRepository.addClass(cls)
        return newClass
    }
    async updateClass(id:string,name:string){
        if(!id){
            throw new Error('Id is required')
        }
        if(!name){
            throw new Error('All required fields must be filled.')
        }
        const existClass = await this.classRepository.findClassById(id)
        if(!existClass){
            throw new Error('Class is not found')
        }
        const cls = new Class({
            name:name,
        })
        const updateClass = await this.classRepository.editClass(id,cls)
        return updateClass
    }
    async deleteClass(id:string):Promise<void>{
        const cls= await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        const students = await this.classRepository.findStudentInClass(id)

        if(students.length > 0){
            throw new Error('Cannot delete class: Please remove all assigned students before deleting the class.')
        }
        await this.classRepository.deleteClass(id)

    }
    async addScore(id:string,item:string,score:number):Promise<Class>{
        const academicYear = getCurrentAcademicYear()
        const cls = await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        const updatedClass = await this.classRepository.addScore(id,academicYear,item,score)
        return updatedClass
    }
    async editScore(id:string,academicYear:string,item:string,score:number):Promise<Class>{
        const cls = await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        const updatedClass = await this.classRepository.editScore(id,academicYear,item,score)
        return updatedClass
    }
    async deleteScore(id:string,academicYear:string,item:string):Promise<Class>{
        const cls = await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        const updatedClass = await this.classRepository.deleteScore(id,academicYear,item)
        return updatedClass
    }
    async fetchClass(id:string):Promise<Class>{
        const cls = await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        return cls
    }

    async addSubject(id:string,subject:string){
        const cls = await this.classRepository.addSubject(id,subject)
        return cls
    }
    async deleteSubject(id:string,subject:string){
        const cls = await this.classRepository.deleteSubject(id,subject)
        return cls
    }
    
}