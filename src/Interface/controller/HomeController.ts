import { HomeUseCase } from "../../application/useCase/HomeUseCase";
import { Request,Response } from "express";
import { StatusCode } from "../../application/constants/statusCode";
export class HomeController {
    constructor(private homeUseCase:HomeUseCase){}

    async fetchDetails(req:Request,res:Response){
        try {
           
            const home = await this.homeUseCase.fetchDetails()
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of admin dashboard is successfull', home });
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async classWiseLeaderBoard(req:Request,res:Response){
        try {
            const classId:string = req.params.classId
            const leaderboard = await this.homeUseCase.fetchLeaderBoard(classId)
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of class leaderboard is successfull', leaderboard });

        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}