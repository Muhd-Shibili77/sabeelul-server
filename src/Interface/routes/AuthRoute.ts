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


export default router

