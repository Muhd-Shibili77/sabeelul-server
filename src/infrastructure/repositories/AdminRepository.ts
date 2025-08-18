import { IAdminRepository } from "../../application/interface/IAdminRepository";
import Admin from "../../domain/entites/Admin";
import AdminModel from "../models/AdminModel";
import TeacherModel from "../models/TeacherModel";
import Teacher from "../../domain/entites/Teacher";
export class AdminRepository implements IAdminRepository {
  async findAdminById(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      return null;
    }
    return new Admin(admin.toObject() as Admin);
  }
  async changePassword(id: string, newPassword: string): Promise<Admin | null> {
    const result = await AdminModel.findByIdAndUpdate(id, {
      password: newPassword,
    });
    if (!result) {
      return null;
    }
    return new Admin(result.toObject() as Admin);
  }
  async blockTeacherById(id: string): Promise<Teacher | null> {
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return null; // or throw new Error("Teacher not found")
    }
    // Toggle isBlock
    teacher.isBlock = !teacher.isBlock;
    await teacher.save();

    return new Teacher(teacher.toObject() as Teacher);
  }
  async blockTeachers(): Promise<Boolean> {
      const result = await TeacherModel.updateMany({},[{ $set: { isBlock: { $not: "$isBlock" } } }])
      return result.modifiedCount > 0; // ✅ true if at least one teacher was updated
  }
}
