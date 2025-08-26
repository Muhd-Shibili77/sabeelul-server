import { IPKVRepository } from "../../application/interface/IPKVRepository";
import PKV from "../../domain/entites/PKV";
import PKVModel from "../models/PKVModel";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";

export class PKVRepository implements IPKVRepository {
  async addPKV(
    studentId: string,
    semester: string,
    phase: string,
    mark: number
  ): Promise<{ phase: string; mark: number }> {
    let record = await PKVModel.findOne({ studentId });

    const newMark = {
      phase,
      mark,
      date: new Date(),
    };

    if (!record) {
      record = new PKVModel({
        studentId,
        PKVmarks: [
          {
            academicYear: getCurrentAcademicYear(),
            semester,
            marks: [newMark],
          },
        ],
      });
    } else {
      let semesterRecord = record.PKVmarks.find((m) => m.semester === semester);
      if (!semesterRecord) {
        record.PKVmarks.push({
          academicYear: getCurrentAcademicYear(),
          semester,
          marks: [newMark],
        });
      } else {
        semesterRecord.marks.push(newMark);
      }
    }

    await record.save();
    // Return only the new mark in frontend format
    return {
      phase: newMark.phase,
      mark: newMark.mark,
    };
  }
  async getPKVByStudentId(studentId: string, semester: string): Promise<any[]> {
    const academicYear = getCurrentAcademicYear();
    const record = await PKVModel.findOne({ studentId });
    if (!record) return [];
    const semesterData = record.PKVmarks.find(
      (m) => m.academicYear === academicYear && m.semester === semester
    );
    if (!semesterData) return [];
    return semesterData.marks.map((mark) => ({
      phase: mark.phase,
      mark: mark.mark,
    }));
  }
  async PKVExist(
    studentId: string,
    semester: string,
    phase: string
  ): Promise<boolean> {
    const academicYear = getCurrentAcademicYear();
    const record = await PKVModel.findOne({ studentId });
    if (!record) return false;

    const semesterRecord = record.PKVmarks.find(
      (m) => m.academicYear === academicYear && m.semester === semester
    );
    if (!semesterRecord) return false;

    return semesterRecord.marks.some((m) => m.phase === phase);
  }
  async updatePKV(
    studentId: string,
    semester: string,
    phase: string,
    mark: number
  ): Promise<{ phase: string; mark: number }> {
    const academicYear = getCurrentAcademicYear();
    const record = await PKVModel.findOne({ studentId });
    if (!record) throw new Error("PKV not found");

    const semesterRecord = record.PKVmarks.find(
      (m) => m.academicYear === academicYear && m.semester === semester
    );
    if (!semesterRecord) throw new Error("Semester not found");

    const phaseRecord = semesterRecord.marks.find((m) => m.phase === phase);
    if (!phaseRecord) throw new Error("Phase not found");

    phaseRecord.mark = mark;
    await record.save();
    return {
      phase: phaseRecord.phase,
      mark: phaseRecord.mark,
    };
  }
}
