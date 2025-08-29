import { IPKVRepository } from "../interface/IPKVRepository";

export class PKVUseCase{
    constructor(private pkvRepository:IPKVRepository){}

    async addPKV(studentId: string,semester:string, phase: string, mark: number) {
        if(!studentId){
            throw new Error("Student ID is required");
        }
        if(!semester){
            throw new Error("Semester is required");
        }
        if(!phase){
            throw new Error("Phase is required");
        }
        if(mark === undefined || mark === null){
            throw new Error("Mark is required");
        }
        const exist = await this.pkvRepository.PKVExist(studentId, semester, phase);
        if(exist){
            throw new Error("PKV for this phase already exists");
        }
        const result = await this.pkvRepository.addPKV(studentId,semester, phase, mark);
        return result;
    }
    async getPKVByStudentId(studentId: string, semester: string | undefined) {
        if (!studentId) {
            throw new Error("Student ID is required");
        }
        if (!semester) {
            throw new Error("Semester is required");
        }
        return await this.pkvRepository.getPKVByStudentId(studentId, semester);
    }
    async getPKVByClassId(classId: string) {
        if (!classId) {
            throw new Error("Class ID is required");
        }
        return await this.pkvRepository.getPKVByClassId(classId);
    }
    async updatePKV(studentId: string, semester: string, phase: string, mark: number) {
        if (!studentId) {
            throw new Error("Student ID is required");
        }
        if (!semester) {
            throw new Error("Semester is required");
        }
        if (!phase) {
            throw new Error("Phase is required");
        }
        if (mark === undefined || mark === null) {
            throw new Error("Mark is required");
        }
        const exist = await this.pkvRepository.PKVExist(studentId, semester, phase);
        if (!exist) {
            throw new Error("PKV for this phase does not exist");
        }
        const result = await this.pkvRepository.updatePKV(studentId, semester, phase, mark);
        return result;
    }
}