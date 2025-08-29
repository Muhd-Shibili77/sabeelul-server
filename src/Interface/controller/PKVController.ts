import { Request, Response } from "express";
import { PKVUseCase } from "../../application/useCase/PKVUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class PKVController {
  constructor(private pkvUseCase: PKVUseCase) {}

  async addPKV(req: Request, res: Response) {
    try {
      const studentId = req.params.id;
      const { semester, phase, mark } = req.body;
      const result = await this.pkvUseCase.addPKV(studentId, semester, phase, mark);
      res.status(StatusCode.CREATED).json({ success: true, message: "PKV added successfully", data: result });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async fetch(req: Request, res: Response) {
    try {
      const studentId = req.params.id;
      const semester = req.query.semester as string | undefined;
      const result = await this.pkvUseCase.getPKVByStudentId(studentId,semester);
      return res.status(StatusCode.OK).json({ success: true, data: result || [] });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async fetchByClass(req: Request, res: Response) {
    try {
      const classId = req.params.id;
      const result = await this.pkvUseCase.getPKVByClassId(classId);
      return res.status(StatusCode.OK).json({ success: true, data: result || [] });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async updatePKV(req: Request, res: Response) {
    try {
      const studentId = req.params.id;
      const { semester, phase, mark } = req.body;
      // Assuming updatePKV is a method in pkvUseCase
      const result = await this.pkvUseCase.updatePKV(studentId, semester, phase, mark);
      res.status(StatusCode.OK).json({ success: true, message: "PKV updated successfully", data: result });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}
