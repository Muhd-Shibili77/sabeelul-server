import { ISemesterRepository } from "../../application/interface/ISemesterRepository";
import Semester from "../../domain/entites/Semester";
import SemesterModel from "../models/SemesterModel";

export class SemesterRepository implements ISemesterRepository {
  async getAllSemesters(): Promise<Semester[]> {
    const semesters = await SemesterModel.find();
    return semesters.map((semester) => new Semester(semester.toObject()));
  }

  async getUnlockedSemesters(): Promise<string[]> {
    const semesters = await SemesterModel.find({ isLocked: false }).select(
      "semester"
    );
    return semesters.map((semester) => semester.semester);
  }
  async toggleLockSemester(id: string): Promise<Semester> {
    if (!id) {
      throw new Error("semester ID Required");
    }
    const semester = await SemesterModel.findById(id);
    if (!semester) {
      throw new Error("Semester not found");
    }
    semester.isLocked = !semester.isLocked;
    await semester.save();
    return new Semester(semester.toObject());
  }
}
