import { ITeacherRepository } from "../../application/interface/ITeacherRepository";
import Teacher from "../../domain/entites/Teacher";
import TeacherModel from "../models/TeacherModel";


export class TeacherRepository implements ITeacherRepository {
  
  async fetchTeachers(
    query: object,
    page: number,
    limit: number
  ): Promise<{ teachers: Teacher[]; totalPages: number }> {
    const count = await TeacherModel.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    const teachers = await TeacherModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ registerNo: 1 });
    return {
      teachers: teachers.map(
        (teacher) => new Teacher(teacher.toObject() as Teacher)
      ),
      totalPages: totalPages,
    };
  }
  

  async addTeacher(teacher: Teacher): Promise<Teacher> {
    const newTeacher = new TeacherModel(teacher);
    await newTeacher.save();
    return new Teacher(newTeacher.toObject() as Teacher);
  }
  
  async deleteTeacher(id: string): Promise<void> {
    await TeacherModel.findByIdAndUpdate(id, { isDeleted: true });
  }
  
  async findTeacherById(id: string): Promise<Teacher | null> {
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return null;
    }
    return new Teacher(teacher.toObject() as Teacher);
  }
  
  async updateTeacher(id: string, teacher: Teacher): Promise<Teacher> {
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(id, teacher, {
      new: true,
    });
    if (!updatedTeacher) {
      throw new Error("Teacher not found");
    }
    return new Teacher(updatedTeacher.toObject() as Teacher);
  }
  
  async countTeacher(): Promise<number> {
      const teachers = await TeacherModel.countDocuments({isDeleted:false})
      return teachers
  }
}
