import { Router,Request,Response } from "express";
import { AdminController } from "../controller/AdminController";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { AdminRepository } from "../../infrastructure/repositories/AdminRepository";

const adminRepository = new AdminRepository();
const adminUseCase = new AdminUseCase(adminRepository);
const adminController = new AdminController(adminUseCase);
const router = Router();

router.route('/teacher')
.get(async (req: Request, res: Response) => {
    await adminController.fetchTeachers(req, res)
})
.post(async (req: Request, res: Response) => {
    await adminController.addTeacher(req, res)
})

router.route('/teacher/:id')
.delete(async (req: Request, res: Response) => {
    await adminController.deleteTeacher(req, res)
})
.put(async (req: Request, res: Response) => {
    await adminController.updateTeacher(req, res)
})


router.route('/student')
.get(async (req: Request, res: Response) => {
    await adminController.fetchStudents(req, res)
})
.post(async (req: Request, res: Response) => {
    await adminController.addStudent(req, res)
})

router.route('/student/:id')
.delete(async (req: Request, res: Response) => {
    await adminController.deleteStudent(req, res)
})
.put(async (req: Request, res: Response) => {
    await adminController.updateStudent(req, res)
})


router.route('/program')
.get(async (req:Request,res:Response)=>{
    await adminController.fetchProgram(req,res)
})
.post(async(req:Request,res:Response)=>{
    await adminController.addProgram(req,res)
})

router.route('/program/:id')
.delete(async (req:Request,res:Response)=>{
    await adminController.deleteProgram(req,res)
})
.put(async (req:Request,res:Response)=>{
    await adminController.updateProgram(req,res)
})

export default router;