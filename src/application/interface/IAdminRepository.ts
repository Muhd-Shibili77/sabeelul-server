import Admin from "../../domain/entites/Admin";

export interface IAdminRepository{
    findAdminById(id:string):Promise<Admin | null>
    changePassword(id:string, newPassword:string):Promise<Admin | null>
}