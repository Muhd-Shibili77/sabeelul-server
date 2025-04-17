import { IAuthRepository } from "../../application/interface/IAuthRepository";
import Admin from "../../domain/entites/Admin";
import AdminModel from "../models/AdminModel";

export class AuthRepository implements IAuthRepository{
    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email});
        if (!admin) return null;
        return new Admin(admin.toObject() as Admin);
    }
}