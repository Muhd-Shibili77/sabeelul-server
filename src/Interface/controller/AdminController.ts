import { Request,Response } from "express";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class AdminController {
    constructor(private adminUseCase : AdminUseCase){}
    
    async getDashboard(req:Request,res:Response){
        try {
            const data = await this.adminUseCase.getDashboard()
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of admin dashboard is successfull', data });

        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async getTheme(req:Request,res:Response){
        try {
            const data = await this.adminUseCase.getTheme()
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of theme is successfull', data });

        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async updateTheme(req:Request,res:Response){
        try {
            const id = req.params.id
            const { minMark,maxMark } = req.body;
            const data = await this.adminUseCase.updateTheme(id,minMark,maxMark)
            res.status(StatusCode.OK).json({ success: true,message:'Updating of theme is successfull', data });

        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}