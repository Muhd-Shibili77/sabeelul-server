import { Router,Request,Response } from "express";
import { ProgramController } from "../controller/ProgranController";
import { ProgramUseCase } from "../../application/useCase/ProgramUseCase";
import { ProgramRespository } from "../../infrastructure/repositories/ProgramRepository";

const programRespository = new ProgramRespository()
const programUseCase = new ProgramUseCase(programRespository)
const programController = new ProgramController(programUseCase)
const router = Router();

router.route('/')
.get(async (req:Request,res:Response)=>{
    await programController.fetchProgram(req,res)
})
.post(async(req:Request,res:Response)=>{
    await programController.addProgram(req,res)
})

router.route('/:id')
.delete(async (req:Request,res:Response)=>{
    await programController.deleteProgram(req,res)
})
.put(async (req:Request,res:Response)=>{
    await programController.updateProgram(req,res)
})

export default router;