import jwtService from "../../infrastructure/services/jwtService";
import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv";
import TeacherModel from "../../infrastructure/models/TeacherModel";
import StudentModel from "../../infrastructure/models/StudentModel";
dotenv.config();

export interface AuthRequest extends Request {
    user?: any;
}

interface DecodedToken {
    role: string;
    userId: string;
}

export const authenticateJWT = (allowedRoles:string[])=>{

    return async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> =>{
        const token = req.header("Authorization")?.split(" ")[1];
        
        if (!token) {
             res.status(401).json({ message: "Access denied. No token provided." });
            return 
        }

        try {
            const decoded = jwtService.verifyAccessToken(token) as DecodedToken
            if (!decoded) {
                res.status(401).json({ message: "Invalid token." });
                return 
            }
            if(decoded.role !== 'Admin'){
                let user;
                if(decoded.role === 'Student'){
                    user = await StudentModel.findById(decoded.userId)
                }else{
                    user = await TeacherModel.findById(decoded.userId)
                }
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                    return;
                }
                if(user.isDeleted){
                    res.status(403).json({ message: "Access denied. Your account has been Deleted." });
                    return;
                }
            }

            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: "Access denied. You do not have permission to perform this action." });
                return 
            }
            req.user = decoded;
            next();
            
        } catch (error) {
            console.error(error)
             res.status(403).json({ message: "Invalid token." });
             return
        }
    }
}