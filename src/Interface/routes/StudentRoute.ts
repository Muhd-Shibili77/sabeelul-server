import { Router,Request,Response } from "express";
import { StudentController } from "../controller/StudentController";
import { StudentUseCase } from "../../application/useCase/StudentUseCase";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";

const studentRepository = new StudentRepository()
const studentUsecase = new StudentUseCase(studentRepository)
const studentController = new StudentController(studentUsecase)
const router = Router()

router.route('/')
.get(async (req: Request, res: Response) => {
    await studentController.fetchStudents(req, res)
})
.post(async (req: Request, res: Response) => {
    await studentController.addStudent(req, res)
})

router.route('/:id')
.delete(async (req: Request, res: Response) => {
    await studentController.deleteStudent(req, res)
})
.put(async (req: Request, res: Response) => {
    await studentController.updateStudent(req, res)
})
.get(async(req:Request,res:Response)=>{
    await studentController.findByAdmNo(req,res)
})

router.route('/score/:id')
.post(async(req:Request,res:Response)=>{
    await studentController.addExtraScore(req,res)
})



export default router