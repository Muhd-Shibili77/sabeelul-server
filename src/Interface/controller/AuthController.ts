import { Request, Response } from "express";
import { AuthUseCase } from "../../application/useCase/AuthUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const reponse = await this.authUseCase.adminLogin(email, password);
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Login successful",
        reponse,
        token: reponse.accessToken,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }
}
