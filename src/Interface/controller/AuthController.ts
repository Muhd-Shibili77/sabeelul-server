import { Request, Response } from "express";
import { AuthUseCase } from "../../application/useCase/AuthUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const response = await this.authUseCase.adminLogin(email, password);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Login successful",
        response,
        token: response.accessToken,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const response = await this.authUseCase.userLogin(login, password);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Login successful",
        response,
        role:response.role,
        token: response.accessToken,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  
}
