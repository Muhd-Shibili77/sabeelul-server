import { Router,Request,Response } from "express";
import { PKVController } from "../controller/PKVController";
import { PKVUseCase } from "../../application/useCase/PKVUseCase";
import { PKVRepository } from "../../infrastructure/repositories/PKVRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";

const pkvRepository = new PKVRepository();
const pkvUseCase = new PKVUseCase(pkvRepository);
const pkvController = new PKVController(pkvUseCase);
const router = Router()

router.post('/add/:id',authenticateJWT(['Teacher']),async (req:Request,res:Response)=>{
    await pkvController.addPKV(req,res)
})
router.get('/fetch/:id',authenticateJWT(['Teacher']),async (req:Request,res:Response)=>{
    await pkvController.fetch(req,res)
})
router.get('/fetchByClass/:id',authenticateJWT(['Teacher','Admin']),async (req:Request,res:Response)=>{
    await pkvController.fetchByClass(req,res)
})
router.put('/update/:id',authenticateJWT(['Teacher']),async (req:Request,res:Response)=>{
    await pkvController.updatePKV(req,res)
})


export default router