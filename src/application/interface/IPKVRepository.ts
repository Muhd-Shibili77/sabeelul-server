import PKV from "../../domain/entites/PKV";

export interface IPKVRepository{
    addPKV(studentId:string,semester:string, phase:string, mark:number): Promise<{ phase: string; mark: number }>;
    getPKVByStudentId(studentId:string,semester:string):Promise<any[]>;
    PKVExist(studentId:string,semester:string, phase:string):Promise<boolean>;
    updatePKV(studentId:string,semester:string, phase:string, mark:number): Promise<{ phase: string; mark: number }>;
}