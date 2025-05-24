import { Router,Request,Response } from "express";
import { AdminController } from "../controller/AdminController";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TeacherRepository } from "../../infrastructure/repositories/TeacherRepository";
import { ClassRepository } from "../../infrastructure/repositories/ClassRepository";
import { ThemeRepository } from "../../infrastructure/repositories/ThemeRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";
const studentRepository = new StudentRepository()
const teacherRepository = new TeacherRepository()
const classRepository = new ClassRepository()
const themeRepository = new ThemeRepository()
const adminUseCase = new AdminUseCase(studentRepository,teacherRepository,classRepository,themeRepository)
const adminController = new AdminController(adminUseCase)
const router = Router()

router.get('/dashboard',authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.getDashboard(req,res)
})
router.route('/theme')
.get(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.getTheme(req,res)
})
.put(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.updateTheme(req,res)
})

export default router
