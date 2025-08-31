import Semester from "../../domain/entites/Semester";

export interface ISemesterRepository {
  getAllSemesters(): Promise<Semester[]>;
  getUnlockedSemesters(): Promise<string[]>;
  toggleLockSemester(id: string): Promise<Semester>;
}
