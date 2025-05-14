import { ProgramUseCase } from "../../application/useCase/ProgramUseCase";
import { Request,Response } from "express";
import { StatusCode } from "../../application/constants/statusCode";
export class ProgramController{
    constructor(private programUseCase : ProgramUseCase){}

    async fetchProgram(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            const query = search
            ? {
                name: { $regex: search, $options: "i" },
                isDeleted: false,
              }
            : {
                isDeleted: false,
              };
          

            const result = await this.programUseCase.fetchPrograms(query, page, limit);
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of programs is successfull', programs: result.programs, totalPages:result.totalPages ?? undefined });

            
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async addProgram(req:Request,res:Response){
        try {
            const {name,startDate,endDate,criteria,classes} = req.body
            const newProgram = await this.programUseCase.addProgram(name,startDate,endDate,criteria,classes)
            res.status(StatusCode.OK).json({ success: true,message:'Adding of program is successfull', data: newProgram });

            
        }  catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async updateProgram(req:Request,res:Response){
        try {
            const id :string = req.params.id;
            const {name,startDate,endDate,criteria,classes} = req.body
            const updatedProgram = await this.programUseCase.updateProgram(id,name,startDate,endDate,criteria,classes)
            res.status(StatusCode.OK).json({ success: true,message:'Updating of program is successfull', data: updatedProgram });
        }  catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async deleteProgram(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            await this.programUseCase.deleteProgram(id)
            res.status(StatusCode.OK).json({ success: true,message:'Deleting of program is successfull' });
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}