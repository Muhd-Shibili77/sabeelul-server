import { Router,Request,Response } from "express";
import { ClassController } from "../controller/ClassController";
import { ClassUseCase } from "../../application/useCase/ClassUseCase";
import { ClassRepository } from "../../infrastructure/repositories/ClassRepository";

const classRepository = new ClassRepository();
const classUseCase = new ClassUseCase(classRepository);
const classController = new ClassController(classUseCase);
const router = Router();

router.route('/')
.get(async (req: Request, res: Response) => {
    await classController.fetchClass(req, res)
})
.post(async (req: Request, res: Response) => {
    await classController.addClass(req, res)
})

router.route('/:id')
.delete(async (req: Request, res: Response) => {
    await classController.deleteClass(req, res)
})
.put(async (req: Request, res: Response) => {
    await classController.updateClass(req, res)
})
router.route('/score/:id')
.post(async (req: Request, res: Response) => {
    await classController.addScore(req, res)
})
.put(async (req: Request, res: Response) => {
    await classController.editScore(req, res)
})
.delete(async (req: Request, res: Response) => {
    await classController.deleteScore(req, res)
})


export default router;