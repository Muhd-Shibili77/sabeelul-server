import { Router,Request,Response } from "express";
import { AdminController } from "../controller/AdminController";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { TeacherRepository } from "../../infrastructure/repositories/TeacherRepository";
import { ExtraMarkItemRepository } from "../../infrastructure/repositories/ExtraMarkItemRepository";
import { ThemeRepository } from "../../infrastructure/repositories/ThemeRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";
const studentRepository = new StudentRepository()
const teacherRepository = new TeacherRepository()
const themeRepository = new ThemeRepository()
const extraMarkItemRepository = new ExtraMarkItemRepository()
const adminUseCase = new AdminUseCase(studentRepository,teacherRepository,themeRepository,extraMarkItemRepository)
const adminController = new AdminController(adminUseCase)
const router = Router()

router.get('/dashboard',authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.getDashboard(req,res)
})
router.route('/theme')
.get(authenticateJWT(['Admin','Student']),async (req:Request,res:Response)=>{
    await adminController.getTheme(req,res)
})
router.route('/theme/:id')
.put(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.updateTheme(req,res)
})
router.route('/extra-mark-item')
.get(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.getExtraMarkItem(req,res)
})
.post(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.addExtraMarkItem(req,res)
})
router.route('/extra-mark-item/:id')
.put(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.updateExtraMarkItem(req,res)
})
.delete(authenticateJWT(['Admin']),async (req:Request,res:Response)=>{
    await adminController.deleteExtraMarkItem(req,res)
})

export default router
