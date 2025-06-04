import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 


const JWT_ACCESS_SECRET:Secret = process.env.JWT_ACCESS_SECRET as string
const JWT_REFRESH_SECRET:Secret = process.env.JWT_REFRESH_SECRET as string
const JWT_EXPIRATION = '10d'
const JWT_REFRESH_EXPIRATION = "30d";

export const generateAccessToken = (userId: string,role:string): string => {
    return jwt.sign({ userId,role }, JWT_ACCESS_SECRET, { expiresIn: JWT_EXPIRATION });
}

export const generateRefreshToken = (userId: string,role:string): string => {
    return jwt.sign({ userId,role }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
}

export const verifyAccessToken=(token:string):JwtPayload | string =>{
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET)as JwtPayload;
    } catch (error:any) {
        if (error.name === "TokenExpiredError") {
            throw { status: 401, message: "Token expired" };
        } else if (error.name === "JsonWebTokenError") {
            throw { status: 403, message: "Invalid token" };
        } else {
            throw { status: 500, message: "Internal server error" };
        }
    }
}

export const verifyRefreshToken = (token:string):JwtPayload =>{
    try {
        return jwt.verify(token,JWT_REFRESH_SECRET)as JwtPayload; 
        
    } catch (error:any) {

        if (error.name === "TokenExpiredError") {
            throw { status: 401, message: "Token expired" };
        } else if (error.name === "JsonWebTokenError") {
            throw { status: 403, message: "Invalid token" };
        } else {
            throw { status: 500, message: "Internal server error" };
        }
    }
}

const jwtService = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};

export default jwtService;

