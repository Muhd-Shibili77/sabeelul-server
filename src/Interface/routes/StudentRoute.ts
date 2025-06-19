import { Router,Request,Response } from "express";
import { StudentController } from "../controller/StudentController";
import { StudentUseCase } from "../../application/useCase/StudentUseCase";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { MarkLogRepository } from "../../infrastructure/repositories/MarkLogRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";
const studentRepository = new StudentRepository()
const markLogRepository = new MarkLogRepository()
const studentUsecase = new StudentUseCase(studentRepository, markLogRepository)
const studentController = new StudentController(studentUsecase)
const router = Router()

router.route('/')
.get(authenticateJWT(['Admin','Teacher']),async (req: Request, res: Response) => {
    await studentController.fetchStudents(req, res)
})
.post(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await studentController.addStudent(req, res)
})

router.route('/:id')
.delete(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await studentController.deleteStudent(req, res)
})
.put(authenticateJWT(['Admin']),async (req: Request, res: Response) => {
    await studentController.updateStudent(req, res)
})
.get(authenticateJWT(['Admin','Teacher',"Student"]),async(req:Request,res:Response)=>{
    await studentController.findByAdmNo(req,res)
})

router.route('/score/:id')
.post(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.addExtraScore(req,res)
})
.put(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.editStudentExtraScore(req,res)
})
.delete(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.deleteStudentExtraScore(req,res)
})
router.route('/penalty/:id')
.post(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.addPenaltyScore(req,res)
})
.put(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.editPenaltyScore(req,res)
})
.delete(authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.deletePenaltyScore(req,res)
})

router.route('/mentor/:id')
.post(authenticateJWT(['Admin','Teacher']),async (req:Request,res:Response)=>{
    await studentController.addMentorScore(req,res)
})
router.route('/cce/batch')
.post(async (req:Request,res:Response)=>{
    await studentController.addCceScore(req,res)
})
router.get('/profile/:id',authenticateJWT(['Admin','Teacher','Student']),async(req:Request,res:Response)=>{
    await studentController.fetchProfile(req,res)
})
router.get('/dashboard/:id',async(req:Request,res:Response)=>{
    await studentController.dashboard(req,res)
})
router.get('/performance/:id',authenticateJWT(['Student']),async(req:Request,res:Response)=>{
    await studentController.performance(req,res)
})

router.get('/class/:id',authenticateJWT(['Admin','Teacher']),async(req:Request,res:Response)=>{
    await studentController.fetchByClass(req,res)
})

export default router