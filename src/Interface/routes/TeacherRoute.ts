import { Router,Request,Response } from "express";
import { TeacherController } from "../controller/TeacherController";
import { TeacherUseCase } from "../../application/useCase/TeacherUseCase";
import { TeacherRepository } from "../../infrastructure/repositories/TeacherRepository";


const teacherRepository = new TeacherRepository();
const teacherUseCase = new TeacherUseCase(teacherRepository);
const teacherController = new TeacherController(teacherUseCase);
const router = Router();

router.route('/')
.get(async (req: Request, res: Response) => {
    await teacherController.fetchTeachers(req, res)
})
.post(async (req: Request, res: Response) => {
    await teacherController.addTeacher(req, res)
})

router.route('/:id')
.delete(async (req: Request, res: Response) => {
    await teacherController.deleteTeacher(req, res)
})
.put(async (req: Request, res: Response) => {
    await teacherController.updateTeacher(req, res)
})

router.get('/profile',async (req:Request,res:Response)=>{
    await teacherController.fetchProfile(req,res)
})




export default router;