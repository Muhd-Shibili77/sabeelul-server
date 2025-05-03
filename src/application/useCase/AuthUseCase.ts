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
       
        const isPasswordValid = await bcrypt.compare(password,admin.password);
       
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const accessToken = jwtService.generateAccessToken(admin.id,'Admin')
        const refreshToken = jwtService.generateRefreshToken(admin.id,'Admin')
        return { accessToken, refreshToken };
        
    }
    async userLogin(login: string, password: string) {
        
        const teacher = await this.authRepository.findTeacher(login);
        const student = await this.authRepository.findStudent(login);
    
        const account = teacher || student;
        if (!account) {
            throw new Error("User not found");
        }
    
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
    
        const role = teacher ? 'Teacher' : 'Student';
    
        const accessToken = jwtService.generateAccessToken(account.id, role);
        const refreshToken = jwtService.generateRefreshToken(account.id, role);
    
        return { accessToken, refreshToken, role };
    }
   
    async newAccessToken(refreshToken:string){
        const decoded =  jwtService.verifyRefreshToken(refreshToken)
        const newAccessToken = jwtService.generateAccessToken(decoded.userId,decoded.role)
        return newAccessToken
      }
    
}