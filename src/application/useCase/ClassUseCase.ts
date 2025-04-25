import Class from "../../domain/entites/Class";
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
        const cls = new Class({
            name:name,
            subjects:subjects
        })
        const newClass = await this.classRepository.addClass(cls)
        return newClass
    }
    async updateClass(id:string,name:string,subjects:string[]){
        if(!id){
            throw new Error('Id is required')
        }
        if(!name || !subjects){
            throw new Error('All required fields must be filled.')
        }
        const existClass = await this.classRepository.findClassById(id)
        if(!existClass){
            throw new Error('Class is not found')
        }
        const cls = new Class({
            name:name,
            subjects:subjects
        })
        const updateClass = await this.classRepository.editClass(id,cls)
        return updateClass
    }
    async deleteClass(id:string):Promise<void>{
        const cls= await this.classRepository.findClassById(id)
        if(!cls){
            throw new Error('Class not found')
        }
        await this.classRepository.deleteClass(id)

    }
    async addScore(id:string,academicYear:string,item:string,score:number):Promise<Class>{
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
}