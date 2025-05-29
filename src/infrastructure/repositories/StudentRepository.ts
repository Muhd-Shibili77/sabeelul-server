import mongoose, { PipelineStage, Types } from "mongoose";
import { IStudentRepository } from "../../application/interface/IStudentRepository";
import Student from "../../domain/entites/Student";
import StudentModel from "../models/StudentModel";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { ClassPerformance } from "../../domain/types/classPerfromance";
import classModel from "../models/ClassModel";
import TeacherModel from "../models/TeacherModel";
export class StudentRepository implements IStudentRepository {
  async addStudent(student: Student): Promise<Student> {
    const newStudent = new StudentModel(student);
    await newStudent.save();
    return new Student(newStudent.toObject() as Student);
  }
  async updateStudent(id: string, student: Student): Promise<Student> {
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, student, {
      new: true,
    });
    if (!updatedStudent) {
      throw new Error("Student not found");
    }
    return new Student(updatedStudent.toObject() as Student);
  }
  async findStudentById(id: string): Promise<Student | null> {
    const student = await StudentModel.findOne({ _id: id, isDeleted: false });
    if (!student) {
      return null;
    }
    return new Student(student.toObject() as Student);
  }
  async deleteStudent(id: string): Promise<void> {
    await StudentModel.findByIdAndUpdate(id, { isDeleted: true });
  }
  async fetchStudents(
    query: object,
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalPages: number }> {
    const count = await StudentModel.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const students = await StudentModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ admissionNo: 1 })
      .populate("classId name");
    return {
      students: students.map(
        (student) => new Student(student.toObject() as Student)
      ),
      totalPages: totalPages,
    };
  }
  async findByAdNo(admissionNo: string): Promise<Student | null> {
    const studentDoc = await StudentModel.findOne({
      admissionNo,
      isDeleted: false,
    });

    if (!studentDoc) {
      return null;
    }

    // Check if programId exists before populating
    if ((studentDoc as any).programId) {
      await studentDoc.populate("programId");
    }

    return new Student(studentDoc.toObject() as Student);
  }

  async deleteExtraScore(id: string): Promise<null> {
    const result = await StudentModel.updateOne(
      { "extraMarks._id": id },
      { $pull: { extraMarks: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Extra mark not found or already deleted");
    }

    return null;
  }

  async editExtraScore(id: string, mark: number,description:string): Promise<void> {
    const result = await StudentModel.updateOne(
      { "extraMarks._id": id },
      { $set: { "extraMarks.$.mark": mark,"extraMarks.$.description": description } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Extra mark not found or update failed");
    }
  }

  async addExtraScore(
    id: string,
    academicYear: string,
    programName: string,
    mark: number,
    description: string
  ): Promise<Student> {
    const updateData: any = { academicYear, mark, description };
    if (mongoose.Types.ObjectId.isValid(programName)) {
      updateData.programId = programName;
    } else {
      updateData.customProgramName = programName;
    }

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      {
        $push: {
          extraMarks: updateData,
        },
      },
      { new: true }
    );
    if (!updatedStudent) {
      throw new Error("student add score failed");
    }
    return new Student(updatedStudent.toObject() as Student);
  }

  async addMentorScore(
    id: string,
    academicYear: string,
    mark: number,
    semester: string
  ): Promise<Student> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("student not found");
    }

    if (!student.mentorMarks) {
      student.mentorMarks = [];
    }
    const existingMarkIndex = student.mentorMarks.findIndex(
      (entry) =>
        entry.academicYear === academicYear && entry.semester === semester
    );

    if (existingMarkIndex !== -1) {
      student.mentorMarks[existingMarkIndex].mark = mark;
      student.mentorMarks[existingMarkIndex].date = new Date();
    } else {
      student.mentorMarks.push({
        academicYear,
        semester,
        mark,
        date: new Date(),
      });
    }

    const updatedStudent = await student.save();

    if (!updatedStudent) {
      throw new Error("Adding mentor failed");
    }
    return new Student(updatedStudent.toObject() as Student);
  }
  async addCceScore(
    id: string,
    academicYear: string,
    semester: string,
    classId: string,
    subjectName: string,
    phase: string,
    mark: number
  ): Promise<Student> {
    const classDoc = await classModel.findById(classId).select("name");
    const className = classDoc?.name;
    if (!className) {
      throw new Error("class not found");
    }
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Initialize cceMarks if undefined
    if (!student.cceMarks) {
      student.cceMarks = [];
    }

    // Find academic record
    const academicRecord = student.cceMarks.find(
      (record) =>
        record.academicYear === academicYear &&
        record.semester === semester &&
        record.className === className
    );

    if (academicRecord) {
      // Try to find the subject and phase entry
      const subjectPhaseEntry = academicRecord.subjects.find(
        (entry) => entry.subjectName === subjectName && entry.phase === phase
      );

      if (subjectPhaseEntry) {
        // If entry exists, update the mark
        subjectPhaseEntry.mark = mark;
      } else {
        // Else, push a new entry
        academicRecord.subjects.push({
          subjectName,
          phase,
          mark,
          date: new Date(),
        });
      }
    } else {
      // If academicYear record doesn't exist, create it
      student.cceMarks.push({
        academicYear,
        semester,
        className,
        subjects: [
          {
            subjectName,
            phase,
            mark,
            date: new Date(),
          },
        ],
      });
    }

    await student.save();
    return new Student(student.toObject() as Student);
  }

  async fetchProfile(id: string): Promise<Student> {
    const student = await StudentModel.findById(id)
      .populate("classId")
      .populate("extraMarks.programId")
      .exec();
    return new Student(student?.toObject() as Student);
  }

  async countStudent(): Promise<number> {
    const students = await StudentModel.countDocuments({ isDeleted: false });
    return students;
  }

  async bestPerfomerClass(): Promise<Student[]> {
    const academicYear = getCurrentAcademicYear();

    const bestStudentsPipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $addFields: {
          totalExtraMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$extraMarks",
                    as: "em",
                    cond: { $eq: ["$$em.academicYear", academicYear] },
                  },
                },
                as: "emf",
                in: "$$emf.mark",
              },
            },
          },
          totalMentorMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$mentorMarks",
                    as: "mm",
                    cond: { $eq: ["$$mm.academicYear", academicYear] },
                  },
                },
                as: "mmf",
                in: "$$mmf.mark",
              },
            },
          },
          totalCceScore: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cceMarks",
                    as: "cce",
                    cond: { $eq: ["$$cce.academicYear", academicYear] },
                  },
                },
                as: "ccef",
                in: {
                  $sum: {
                    $map: {
                      input: "$$ccef.subjects",
                      as: "sub",
                      in: {
                        $multiply: ["$$sub.mark", 0.2],
                      },
                    },
                  },
                },
              },
            },
          },
          totalPenaltyMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$penaltyMarks",
                    as: "pm",
                    cond: { $eq: ["$$pm.academicYear", academicYear] },
                  },
                },
                as: "pmf",
                in: "$$pmf.penaltyScore",
              },
            },
          },
        },
      },
      {
        $addFields: {
          performanceScore: {
            $subtract: [
              {
                $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceScore"],
              },
              "$totalPenaltyMark",
            ],
          },
        },
      },
      {
        $sort: { classId: 1, performanceScore: -1 },
      },
      {
        $group: {
          _id: "$classId",
          bestStudent: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$bestStudent" },
      },
      {
        $lookup: {
          from: "classes", // replace with actual class collection name
          localField: "classId",
          foreignField: "_id",
          as: "classId",
        },
      },
      {
        $unwind: "$classId",
      },
      {
        $project: {
          name: 1,
          performanceScore: 1,
          classId: 1,
        },
      },
    ];

    const result = await StudentModel.aggregate(bestStudentsPipeline);
    return result;
  }

  async getBestPerformingClass(): Promise<ClassPerformance[]> {
    const academicYear = getCurrentAcademicYear();

    const result = await StudentModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      { $unwind: { path: "$classInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$extraMarks", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$mentorMarks", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$cceMarks", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$cceMarks.subjects",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: { path: "$penaltyMarks", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          extraMark: {
            $cond: [
              { $eq: ["$extraMarks.academicYear", academicYear] },
              { $ifNull: ["$extraMarks.mark", 0] },
              0,
            ],
          },
          mentorMark: {
            $cond: [
              { $eq: ["$mentorMarks.academicYear", academicYear] },
              { $ifNull: ["$mentorMarks.mark", 0] },
              0,
            ],
          },
          cceMark: {
            $cond: [
              { $eq: ["$cceMarks.academicYear", academicYear] },
              {
                $multiply: [{ $ifNull: ["$cceMarks.subjects.mark", 0] }, 0.2],
              },
              0,
            ],
          },
          penaltyScore: {
            $cond: [
              { $eq: ["$penaltyMarks.academicYear", academicYear] },
              { $ifNull: ["$penaltyMarks.penaltyScore", 0] },
              0,
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            studentId: "$_id",
            classId: "$classId",
            className: "$classInfo.name",
            classLogo: "$classInfo.icon",
          },
          totalExtraMark: { $sum: "$extraMark" },
          totalMentorMark: { $sum: "$mentorMark" },
          totalCceMark: { $sum: "$cceMark" },
          totalPenalty: { $sum: "$penaltyScore" },
          classInfo: { $first: "$classInfo" },
        },
      },

      {
        $addFields: {
          studentTotalScore: {
            $subtract: [
              {
                $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceMark"],
              },
              "$totalPenalty",
            ],
          },
        },
      },

      {
        $group: {
          _id: "$_id.classId",
          className: { $first: "$_id.className" },
          classLogo: { $first: "$_id.classLogo" },
          totalStudentScore: { $sum: "$studentTotalScore" },
          classInfo: { $first: "$classInfo" },
        },
      },

      {
        $addFields: {
          classScore: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$classInfo.marks",
                        as: "m",
                        cond: { $eq: ["$$m.academicYear", academicYear] },
                      },
                    },
                    as: "filteredMark",
                    in: "$$filteredMark.score",
                  },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $addFields: {
          classPenaltyScore: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$classInfo.penaltyMarks",
                        as: "p",
                        cond: { $eq: ["$$p.academicYear", academicYear] },
                      },
                    },
                    as: "filteredPenalty",
                    in: "$$filteredPenalty.penaltyScore",
                  },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $addFields: {
          totalScore: {
            $subtract: [
              { $add: ["$totalStudentScore", "$classScore"] },
              "$classPenaltyScore",
            ],
          },
        },
      },

      { $sort: { totalScore: -1 } },

      {
        $project: {
          _id: 0,
          classId: "$_id",
          className: 1,
          classLogo: 1,
          totalStudentScore: 1,
          classScore: 1,
          classPenaltyScore: 1,
          totalScore: 1,
        },
      },
    ]);

    return result;
  }

  async bestPerformerOverall(): Promise<Student[]> {
    const academicYear = getCurrentAcademicYear();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $addFields: {
          totalExtraMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$extraMarks",
                    as: "em",
                    cond: { $eq: ["$$em.academicYear", academicYear] },
                  },
                },
                as: "emf",
                in: "$$emf.mark",
              },
            },
          },
          totalMentorMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$mentorMarks",
                    as: "mm",
                    cond: { $eq: ["$$mm.academicYear", academicYear] },
                  },
                },
                as: "mmf",
                in: "$$mmf.mark",
              },
            },
          },
          totalCceScore: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cceMarks",
                    as: "cce",
                    cond: { $eq: ["$$cce.academicYear", academicYear] },
                  },
                },
                as: "ccef",
                in: {
                  $sum: {
                    $map: {
                      input: "$$ccef.subjects",
                      as: "sub",
                      in: {
                        $multiply: ["$$sub.mark", 0.2],
                      },
                    },
                  },
                },
              },
            },
          },
          totalPenaltyMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$penaltyMarks",
                    as: "pen",
                    cond: { $eq: ["$$pen.academicYear", academicYear] },
                  },
                },
                as: "penf",
                in: "$$penf.penaltyScore",
              },
            },
          },
        },
      },
      {
        $addFields: {
          performanceScore: {
            $subtract: [
              {
                $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceScore"],
              },
              { $ifNull: ["$totalPenaltyMark", 0] },
            ],
          },
        },
      },
      {
        $sort: { performanceScore: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classId",
        },
      },
      {
        $unwind: "$classId",
      },
      {
        $project: {
          name: 1,
          performanceScore: 1,
          profileImage: 1,
          classId: 1,
        },
      },
    ];

    const result = await StudentModel.aggregate(pipeline);
    return result || null;
  }

  async getTopStudentsInClass(classId: string): Promise<Student[]> {
    const academicYear = getCurrentAcademicYear();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
          classId: new Types.ObjectId(classId),
        },
      },
      {
        $addFields: {
          totalExtraMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$extraMarks",
                    as: "em",
                    cond: { $eq: ["$$em.academicYear", academicYear] },
                  },
                },
                as: "emf",
                in: "$$emf.mark",
              },
            },
          },
          totalMentorMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$mentorMarks",
                    as: "mm",
                    cond: { $eq: ["$$mm.academicYear", academicYear] },
                  },
                },
                as: "mmf",
                in: "$$mmf.mark",
              },
            },
          },
          totalCceScore: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cceMarks",
                    as: "cce",
                    cond: { $eq: ["$$cce.academicYear", academicYear] },
                  },
                },
                as: "ccef",
                in: {
                  $sum: {
                    $map: {
                      input: "$$ccef.subjects",
                      as: "sub",
                      in: {
                        $multiply: ["$$sub.mark", 0.2],
                      },
                    },
                  },
                },
              },
            },
          },
          totalPenaltyMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$penaltyMarks",
                    as: "pen",
                    cond: { $eq: ["$$pen.academicYear", academicYear] },
                  },
                },
                as: "penf",
                in: "$$penf.penaltyScore",
              },
            },
          },
        },
      },
      {
        $addFields: {
          performanceScore: {
            $subtract: [
              {
                $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceScore"],
              },
              { $ifNull: ["$totalPenaltyMark", 0] },
            ],
          },
        },
      },
      {
        $sort: { performanceScore: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classId",
        },
      },
      {
        $unwind: "$classId",
      },
      {
        $project: {
          name: 1,
          performanceScore: 1,
          profileImage: 1,
          classId: 1,
        },
      },
    ];

    const result = await StudentModel.aggregate(pipeline);
    return result || [];
  }

  async getTopClass(): Promise<
    {
      className: string;
      classLogo: string;
      totalStudentScore: number;
      classScore: number;
      classPenaltyScore: number;
      totalScore: number;
    }[]
  > {
    const academicYear = getCurrentAcademicYear();

    const pipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },

      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },

      {
        $unwind: {
          path: "$classInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          totalExtraMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$extraMarks",
                    as: "em",
                    cond: { $eq: ["$$em.academicYear", academicYear] },
                  },
                },
                as: "emf",
                in: "$$emf.mark",
              },
            },
          },
          totalMentorMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$mentorMarks",
                    as: "mm",
                    cond: { $eq: ["$$mm.academicYear", academicYear] },
                  },
                },
                as: "mmf",
                in: "$$mmf.mark",
              },
            },
          },
          totalCceScore: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cceMarks",
                    as: "cce",
                    cond: { $eq: ["$$cce.academicYear", academicYear] },
                  },
                },
                as: "ccef",
                in: {
                  $sum: {
                    $map: {
                      input: "$$ccef.subjects",
                      as: "sub",
                      in: {
                        $multiply: ["$$sub.mark", 0.2],
                      },
                    },
                  },
                },
              },
            },
          },
          totalPenaltyMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$penaltyMarks",
                    as: "pen",
                    cond: { $eq: ["$$pen.academicYear", academicYear] },
                  },
                },
                as: "penf",
                in: "$$penf.penaltyScore",
              },
            },
          },
        },
      },

      {
        $addFields: {
          studentPerformanceScore: {
            $subtract: [
              {
                $add: [
                  "$totalExtraMark",
                  "$totalMentorMark",
                  "$totalCceScore",
                  200, // Optional bonus
                ],
              },
              { $ifNull: ["$totalPenaltyMark", 0] },
            ],
          },
        },
      },

      {
        $group: {
          _id: "$classId",
          className: { $first: "$classInfo.name" },
          classLogo: { $first: "$classInfo.icon" },
          totalStudentScore: { $sum: "$studentPerformanceScore" },
          classInfo: { $first: "$classInfo" },
        },
      },

      {
        $addFields: {
          classScore: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$classInfo.marks",
                        as: "m",
                        cond: { $eq: ["$$m.academicYear", academicYear] },
                      },
                    },
                    as: "filteredMark",
                    in: "$$filteredMark.score",
                  },
                },
              },
              0,
            ],
          },
          classPenaltyScore: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$classInfo.penaltyMarks",
                        as: "p",
                        cond: { $eq: ["$$p.academicYear", academicYear] },
                      },
                    },
                    as: "filteredPenalty",
                    in: "$$filteredPenalty.penaltyScore",
                  },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $addFields: {
          totalScore: {
            $subtract: [
              { $add: ["$totalStudentScore", "$classScore"] },
              "$classPenaltyScore",
            ],
          },
        },
      },

      {
        $project: {
          _id: 0,
          className: 1,
          classLogo: 1,
          totalStudentScore: 1,
          classScore: 1,
          classPenaltyScore: 1,
          totalScore: 1,
        },
      },

      { $sort: { totalScore: -1 } },

      { $limit: 10 },
    ];

    const result = await StudentModel.aggregate(pipeline);
    return result || [];
  }

  async findByClass(classId: string): Promise<(Student & { rankScore: number })[]> {
  const academicYear = getCurrentAcademicYear();

  const students = await StudentModel.find({
    classId,
    isDeleted: false,
  }).populate("classId");

  const rankedStudents = students.map((student) => {
    const studentObj = student.toObject() as Student;

    // ✅ 1. Sum of mentor marks (both semesters in this academic year)
    const mentorMarkTotal = (studentObj.mentorMarks || [])
      .filter((m) => m.academicYear === academicYear)
      .reduce((sum, m) => sum + (m.mark || 0), 0);

    // ✅ 2. Sum 20% of CCE marks (each subject in both semesters)
    const cceMarkTotal = (studentObj.cceMarks || [])
      .filter((cce) => cce.academicYear === academicYear)
      .flatMap((cce) => cce.subjects || [])
      .reduce((sum, subj) => sum + ((subj.mark || 0) * 0.2), 0);

    // ✅ 3. Sum of extra marks
    const extraMarkTotal = (studentObj.extraMarks || [])
      .filter((extra) => extra.academicYear === academicYear)
      .reduce((sum, e) => sum + (e.mark || 0), 0);

    // ✅ 4. Sum of penalty marks
    const penaltyTotal = (studentObj.penaltyMarks || [])
      .filter((penalty) => penalty.academicYear === academicYear)
      .reduce((sum, p) => sum + (p.penaltyScore || 0), 0);

    const rankScore = mentorMarkTotal + cceMarkTotal + extraMarkTotal - penaltyTotal;

    return {
      ...studentObj,
      rankScore,
    };
  });

  // ✅ Sort students by rankScore descending (highest first)
  rankedStudents.sort((a, b) => b.rankScore - a.rankScore);

  return rankedStudents;
}


  async isExist(data: string): Promise<boolean> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data); // basic email regex
    const query = isEmail ? { email: data } : { phone: data };
    const student = await StudentModel.findOne(query).lean();
    const teacher = await TeacherModel.findOne(query).lean();

    return !!student || !!teacher;
  }

  async addPenaltyScore(
    id: string,
    academicYear: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Student> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("student not found");
    }
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      {
        $push: {
          penaltyMarks: { academicYear, reason, penaltyScore, description },
        },
      },
      { new: true }
    );
    if (!updatedStudent) {
      throw new Error("Class add score failed");
    }
    return new Student(updatedStudent.toObject() as Student);
  }
  async editPenaltyScore(
    id: string,
    markId: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Student> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("student not found");
    }
    const markExists = student.penaltyMarks?.some(
      (m: any) => m._id.toString() === markId
    );
    if (!markExists) {
      throw new Error("Penalty Mark not found for this student");
    }
    const updatedStudentDoc = await StudentModel.findOneAndUpdate(
      { _id: id, "penaltyMarks._id": markId },
      {
        $set: {
          "penaltyMarks.$.penaltyScore": penaltyScore,
          "penaltyMarks.$.reason": reason,
          "penaltyMarks.$.description": description,
        },
      },
      { new: true }
    );
    if (!updatedStudentDoc) {
      throw new Error("Failed to update the score");
    }

    return new Student(updatedStudentDoc.toObject() as Student);
  }
  async deletePenaltyScore(id: string, markId: string): Promise<void> {
    const result = await StudentModel.findByIdAndUpdate(
      id,
      { $pull: { penaltyMarks: { _id: markId } } },
      { new: true }
    );
    if (!result) {
      throw new Error("Failed to delete penalty score from student");
    }
  }
}
