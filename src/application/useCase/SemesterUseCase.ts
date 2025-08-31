import { ISemesterRepository } from "../interface/ISemesterRepository";

export class SemesterUseCase {
  constructor(private semesterRepository: ISemesterRepository) {}

  async getAllSemesters() {
    return this.semesterRepository.getAllSemesters();
  }

  async getUnlockedSemesters() {
    return this.semesterRepository.getUnlockedSemesters();
  }
  async toggleLockSemester(id: string) {
    if (!id) {
      throw new Error("semester ID Required");
    }
    return this.semesterRepository.toggleLockSemester(id);
  }
}
