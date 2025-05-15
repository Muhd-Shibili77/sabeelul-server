import { Router,Request,Response } from "express";
import { HomeController } from "../controller/HomeController";
import { HomeUseCase } from "../../application/useCase/HomeUseCase";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { ProgramRespository } from "../../infrastructure/repositories/ProgramRepository";

const studentRepository = new StudentRepository()
const programRespository = new ProgramRespository()
const homeUseCase = new HomeUseCase(studentRepository,programRespository)
const homeController = new HomeController(homeUseCase)
const router = Router();

router.get('/',async(req:Request,res:Response)=>{
    await homeController.fetchDetails(req,res)
})
router.get('/leaderboard/classes',async(req:Request,res:Response)=>{
    await homeController.fetchClassLeaderBoard(req,res)
})

router.get('/leaderboard/:classId',async(req:Request,res:Response)=>{
    await homeController.classWiseLeaderBoard(req,res)
})



export default router;