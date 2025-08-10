import { Router, Request, Response } from "express";
import { ClassController } from "../controller/ClassController";
import { ClassUseCase } from "../../application/useCase/ClassUseCase";
import { ClassRepository } from "../../infrastructure/repositories/ClassRepository";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { uploadClassIcon } from "../../infrastructure/config/multer";

const classRepository = new ClassRepository();
const studentRepository = new StudentRepository();
const classUseCase = new ClassUseCase(classRepository, studentRepository);
const classController = new ClassController(classUseCase);
const router = Router();

router
  .route("/full-score")
  .get(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.getFullScore(req, res);
  });

router
  .route("/leaderboard")
  .get(
    authenticateJWT(["Admin", "Teacher"]),
    async (req: Request, res: Response) => {
      await classController.fetchLeaderboard(req, res);
    }
  );

router
  .route("/")
  .get(async (req: Request, res: Response) => {
    await classController.fetchClass(req, res);
  })
  .post(
    uploadClassIcon.single("icon"),
    authenticateJWT(["Admin"]),
    async (req: Request, res: Response) => {
      await classController.addClass(req, res);
    }
  );

router
  .route("/:id")
  .get(
    authenticateJWT(["Admin", "Teacher"]),
    async (req: Request, res: Response) => {
      await classController.fetchClass(req, res);
    }
  )
  .delete(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.deleteClass(req, res);
  })
  .put(
    uploadClassIcon.single("icon"),
    authenticateJWT(["Admin"]),
    async (req: Request, res: Response) => {
      await classController.updateClass(req, res);
    }
  );
router
  .route("/score/:id")
  .post(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.addScore(req, res);
  })
  .put(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.editScore(req, res);
  })
  .delete(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.deleteScore(req, res);
  });

router
  .route("/penalty/:id")
  .post(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.addPenaltyScore(req, res);
  })
  .put(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.editPenaltyScore(req, res);
  })
  .delete(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.deletePenaltyScore(req, res);
  });

router
  .route("/subject/:id")
  .post(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.addSubject(req, res);
  })
  .delete(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.deleteSubject(req, res);
  })
  .get(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.getSubjects(req, res);
  });

router
  .route("/publish-score/:id")
  .post(authenticateJWT(["Admin"]), async (req: Request, res: Response) => {
    await classController.publishScore(req, res);
  });

export default router;
