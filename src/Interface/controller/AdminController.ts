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
}