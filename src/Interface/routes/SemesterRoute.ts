import { Router,Request,Response } from "express";
import { SemesterController } from "../controller/SemesterController";
import { SemesterUseCase } from "../../application/useCase/SemesterUseCase";
import { SemesterRepository } from "../../infrastructure/repositories/SemesterRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";

const semesterRepository = new SemesterRepository();
const semesterUseCase = new SemesterUseCase(semesterRepository);
const semesterController = new SemesterController(semesterUseCase);
const router = Router()

router.get('/all',authenticateJWT(['Admin','Teacher']),async (req:Request,res:Response)=>{
  await semesterController.getAllSemesters(req,res)
})
router.get('/unlocked',authenticateJWT(['Admin','Teacher']),async (req:Request,res:Response)=>{
  await semesterController.getUnlockedSemesters(req,res)
})
router.patch('/toggle-lock/:id',authenticateJWT(['Admin','Teacher']),async (req:Request,res:Response)=>{
  await semesterController.toggleLockSemester(req,res)
})
export default router