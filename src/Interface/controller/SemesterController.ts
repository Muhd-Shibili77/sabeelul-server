import { Request, Response } from "express";
import { SemesterUseCase } from "../../application/useCase/SemesterUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class SemesterController {
  constructor(private semesterUseCase: SemesterUseCase) {}

  async getAllSemesters(req: Request, res: Response) {
    try {
      const result = await this.semesterUseCase.getAllSemesters();
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetched all semesters successfully",
        result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async getUnlockedSemesters(req: Request, res: Response) {
    try {
      const result = await this.semesterUseCase.getUnlockedSemesters();
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetched unlocked semesters successfully",
        result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async toggleLockSemester(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.semesterUseCase.toggleLockSemester(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Toggled semester lock status successfully",
        result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}
