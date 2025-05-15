import { ClassUseCase } from "../../application/useCase/ClassUseCase";
import { Request, Response } from "express";
import { StatusCode } from "../../application/constants/statusCode";
export class ClassController {
  constructor(private classUseCase: ClassUseCase) {}

  async fetchClass(req: Request, res: Response) {
    try {
      const search: string = (req.query.search as string) || "";
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;

      const query = search
        ? { name: { $regex: search, $options: "i" }, isDeleted: false }
        : { isDeleted: false };

      const result = await this.classUseCase.fetchClasses(query, page, limit);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of classes is successfull",
        classes: result.classes,
        totalPages: result.totalPages ?? undefined,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async addClass(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
   
      const icon = `uploads/classIcons/${req.file.filename}`;
      const { name} = req.body;
      const subjects: string[] = [];
      const newClass = await this.classUseCase.addClass(name, icon, subjects);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Adding of class is successfull",
        newClass,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async updateClass(req: Request, res: Response) {
    try {

       if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const id: string = req.params.id;
      const { name } = req.body;
      let icon = undefined;

      if (req.file) {
           icon = `uploads/classIcons/${req.file.filename}`;
      }
      const updatedClass = await this.classUseCase.updateClass(id, name, icon);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Updating of class is successfull",
        data: updatedClass,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteClass(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      await this.classUseCase.deleteClass(id);
      res
        .status(StatusCode.OK)
        .json({ success: true, message: "Deleting of class is successfull" });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { item, score } = req.body;
      const updatedClass = await this.classUseCase.addScore(id, item, score);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Adding of score is successfull",
        data: updatedClass,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async editScore(req: Request, res: Response) {
    try {
      const { updatedMark, markId } = req.body;

      // Access values like this:
      const item = updatedMark.item;
      const score = updatedMark.score;
      const id: string = req.params.id;
      const updatedClass = await this.classUseCase.editScore(
        id,
        markId,
        item,
        score
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Editing of score is successfull",
        data: updatedClass,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteScore(req: Request, res: Response) {
    try {
      const classId = req.params.id;
      const { markId } = req.body;
      const updatedClass = await this.classUseCase.deleteScore(classId, markId);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Deleting of score is successfull",
        data: updatedClass,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async findClass(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const cls = await this.classUseCase.fetchClass(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching of class is successfull",
        cls,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async addSubject(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { name } = req.body;
      const response = await this.classUseCase.addSubject(id, name);
      res.status(StatusCode.OK).json({
        success: true,
        message: "add subject to class is successfull",
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteSubject(req: Request, res: Response) {
    try {
      const id: string = req.params.id;

      const { name } = req.body;
      const response = await this.classUseCase.deleteSubject(id, name);
      res.status(StatusCode.OK).json({
        success: true,
        message: "delete subject to class is successfull",
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}
