import { Router,Request,Response } from "express";
import { TeacherController } from "../controller/TeacherController";
import { TeacherUseCase } from "../../application/useCase/TeacherUseCase";
import { TeacherRepository } from "../../infrastructure/repositories/TeacherRepository";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";

const teacherRepository = new TeacherRepository();
const teacherUseCase = new TeacherUseCase(teacherRepository);
const teacherController = new TeacherController(teacherUseCase);
const router = Router();

router.route('/')
.get(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await teacherController.fetchTeachers(req, res)
})
.post(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await teacherController.addTeacher(req, res)
})

router.route('/:id')
.delete(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await teacherController.deleteTeacher(req, res)
})
.put(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await teacherController.updateTeacher(req, res)
})
.get(authenticateJWT(['Admin','Teacher']),async (req:Request,res:Response)=>{
    await teacherController.fetchProfile(req,res)
})









export default router;