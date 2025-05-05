import { Router,Request,Response } from "express";
import { ProgramController } from "../controller/ProgranController";
import { ProgramUseCase } from "../../application/useCase/ProgramUseCase";
import { ProgramRespository } from "../../infrastructure/repositories/ProgramRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";
const programRespository = new ProgramRespository()
const programUseCase = new ProgramUseCase(programRespository)
const programController = new ProgramController(programUseCase)
const router = Router();

router.route('/')
.get(authenticateJWT(['Admin','Teacher','Student']),async (req:Request,res:Response)=>{
    await programController.fetchProgram(req,res)
})
.post(authenticateJWT(['Admin']),async(req:Request,res:Response)=>{
    await programController.addProgram(req,res)
})

router.route('/:id')
.delete(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await programController.deleteProgram(req,res)
})
.put(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await programController.updateProgram(req,res)
})

export default router;