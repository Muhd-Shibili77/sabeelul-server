import { Request, Response } from "express";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class AdminController {
  constructor(private adminUseCase: AdminUseCase) {}

  async changePassword(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const result = await this.adminUseCase.changePassword(
        id,
        currentPassword,
        newPassword,
        confirmPassword
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Password changed successfull",
        result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async getDashboard(req: Request, res: Response) {
    try {
      const data = await this.adminUseCase.getDashboard();
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of admin dashboard is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async getTheme(req: Request, res: Response) {
    try {
      const data = await this.adminUseCase.getTheme();
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of theme is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async updateTheme(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { minMark, maxMark } = req.body;
      const data = await this.adminUseCase.updateTheme(id, minMark, maxMark);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Updating of theme is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async getExtraMarkItem(req: Request, res: Response) {
    try {
      const data = await this.adminUseCase.getExtraMarkItem();
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of extra mark item is successfull",
        items: data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addExtraMarkItem(req: Request, res: Response) {
    try {
      const { item, description } = req.body;
      const data = await this.adminUseCase.addExtraMarkItem(item, description);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Adding of extra mark item is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async updateExtraMarkItem(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { item, description } = req.body;
      const data = await this.adminUseCase.updateExtraMarkItem(
        id,
        item,
        description
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Updating of extra mark item is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteExtraMarkItem(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = await this.adminUseCase.deleteExtraMarkItem(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Deleting of extra mark item is successfull",
        data,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async blockTeachers(req: Request, res: Response) {
    try {
      const result = await this.adminUseCase.blockTeachers();
      res.status(StatusCode.OK).json({
        success: true,
        message: "successfully toggle Block status teachers",
        result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async blockTeacherById(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const result = await this.adminUseCase.blockTeacherById(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Toggle block status of teacher successfull",
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
