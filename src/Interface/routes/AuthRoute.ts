import { Router,Request,Response } from "express";
import { AuthController } from "../controller/AuthController";
import { AuthUseCase } from "../../application/useCase/AuthUseCase";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";

const authRepository = new AuthRepository();
const authUseCase = new AuthUseCase(authRepository);
const authController = new AuthController(authUseCase);
const router = Router();

router.post('/admin/login',async (req: Request, res: Response) => {
    await authController.adminLogin(req, res)
})
router.post('/admin/logout',async (req: Request, res: Response) => {
    await authController.adminLogout(req, res)
})
router.post('/login',async (req: Request, res: Response) => {
    await authController.userLogin(req, res)
})
router.post('/refresh-token',async(req:Request,res:Response):Promise<void>=>{
    await authController.refreshAccessToken(req,res)
})


export default router

