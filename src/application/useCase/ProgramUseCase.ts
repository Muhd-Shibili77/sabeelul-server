import Program from "../../domain/entites/Program";
import { IProgramRepository } from "../interface/IProgramRepository";

export class ProgramUseCase{
    constructor(private programRepository : IProgramRepository){}
    
    async fetchPrograms(query: object = {}, page?: number, limit?: number) {
        return await this.programRepository.fetchPrograms(query, page, limit);
    }

    async addProgram(name:string,startDate:Date,endDate:Date,criteria:string,classes:string[]):Promise<Program>{
        if(!name || !startDate || !endDate || !criteria || !classes){
            throw new Error('All required fields must be filled.')
        }
        const now = new Date();
        if (startDate < now) {
            throw new Error('Start date must be in the future.');
        }
        if (endDate < startDate) {
            throw new Error('End date must be after start date.');
        }

        const program = new Program({
            name:name,
            startDate:startDate,
            endDate:endDate,
            criteria:criteria,
            classes:classes
        })
        const newProgram = await this.programRepository.addProgram(program)
        return newProgram
    }
    async updateProgram(id:string,name:string,startDate:Date,endDate:Date,criteria:string,classes:string[]):Promise<Program>{
        if(!id){
            throw new Error('Id is required')
        }
        if(!name || !startDate || !endDate || !criteria || !classes){
            throw new Error('All required fields must be filled.')
        }
        const now = new Date();
        if (startDate < now) {
            throw new Error('Start date must be in the future.');
        }
        if (endDate < startDate) {
            throw new Error('End date must be after start date.');
        }

        const program = new Program({
            name:name,
            startDate:startDate,
            endDate:endDate,
            criteria:criteria,
            classes:classes
        })
        const updatedProgram = await this.programRepository.editProgram(id,program)
        return updatedProgram
    }
    async deleteProgram(id:string):Promise<void>{
        const program = await this.programRepository.findProgramById(id)
        if(!program){
            throw new Error('Program not found')
        }
        if(program.isDeleted){
            throw new Error('Program already deleted')
        }   
        await this.programRepository.deleteProgram(id)
    }
}