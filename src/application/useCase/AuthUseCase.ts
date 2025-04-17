import jwtService from "../../infrastructure/services/jwtService";
import { IAuthRepository } from "../interface/IAuthRepository";
import bcrypt from "bcrypt";

export class AuthUseCase {
    constructor(private authRepository: IAuthRepository) {}

    async adminLogin(email: string, password: string){
        const admin = await this.authRepository.findByEmail(email);
        if (!admin) {
            throw new Error("Admin not found");
        }
        const isPasswordValid = await bcrypt.compare(admin.password, password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const accessToken = jwtService.generateAccessToken(admin.id,'Admin')
        const refreshToken = jwtService.generateRefreshToken(admin.id,'Admin')
        return { accessToken, refreshToken };
        
    }
}