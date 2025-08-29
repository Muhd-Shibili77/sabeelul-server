import { IPKVRepository } from "../../application/interface/IPKVRepository";
import PKV from "../../domain/entites/PKV";
import PKVModel from "../models/PKVModel";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import mongoose from "mongoose";

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
  async getPKVByClassId(classId: string): Promise<any[]> {
    const academicYear = getCurrentAcademicYear();

    const records = await PKVModel.aggregate([
      // Lookup student info
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      // Match only students in the given class
      {
        $match: {
          "student.classId": new mongoose.Types.ObjectId(classId),
        },
      },

      // Keep only required fields + filtered PKVmarks
      {
        $project: {
          studentId: 1,
          "student.name": 1,
          "student.admissionNo": 1,
          PKVmarks: {
            $filter: {
              input: "$PKVmarks",
              as: "m",
              cond: { $eq: ["$$m.academicYear", academicYear] },
            },
          },
        },
      },
    ]);

    // Flatten out marks into studentId + phase-wise entries
    return records.flatMap((record) =>
      record.PKVmarks.flatMap((m: any) =>
        m.marks.map((mark: any) => ({
          studentId: record.studentId,
          studentName: record.student.name,
          admissionNo: record.student.admissionNo,
          semester: m.semester,
          ...mark,
        }))
      )
    );
  }
}
