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

  async adminLogout(req:Request,res:Response){
    try {

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(StatusCode.OK).json({ success: true, message: "Refresh token cleared successfully." });
      


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

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token missing" });
      }

      const newAccessToken = await this.authUseCase.newAccessToken(
        refreshToken
      );
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }

  
}
