import Admin from "../../domain/entites/Admin";
import Teacher from "../../domain/entites/Teacher";
export interface IAdminRepository{
    findAdminById(id:string):Promise<Admin | null>
    changePassword(id:string, newPassword:string):Promise<Admin | null>
    blockTeacherById(id:string):Promise<Teacher | null>
    blockTeachers():Promise<Boolean>
}