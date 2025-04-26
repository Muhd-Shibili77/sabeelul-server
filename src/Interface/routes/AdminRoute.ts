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




export default router;