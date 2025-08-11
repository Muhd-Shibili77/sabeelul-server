import { IAdminRepository } from "../../application/interface/IAdminRepository";
import Admin from "../../domain/entites/Admin";
import AdminModel from "../models/AdminModel";

export class AdminRepository implements IAdminRepository{
    async findAdminById(id: string): Promise<Admin | null> {
        const admin = await AdminModel.findById(id)
        if(!admin){
            return null
        }
        return new Admin(admin.toObject() as Admin)
    }
    async changePassword(id: string, newPassword: string): Promise<Admin | null> {
        const result = await AdminModel.findByIdAndUpdate(id,{password:newPassword})
        if(!result){
            return null
        }
        return new Admin(result.toObject() as Admin)
    }
}