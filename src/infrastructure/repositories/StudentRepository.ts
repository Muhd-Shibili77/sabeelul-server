import mongoose, { PipelineStage, Types } from "mongoose";
import { IStudentRepository } from "../../application/interface/IStudentRepository";
import Student from "../../domain/entites/Student";
import StudentModel from "../models/StudentModel";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { ClassPerformance } from "../../domain/types/classPerfromance";
import classModel from "../models/ClassModel";
import TeacherModel from "../models/TeacherModel";
import ExtraMarkItemModel from "../models/ExtraMarkItemModel";
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
    const student = await StudentModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate("classId name");
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
    limit: number,
    isClassFiltered: boolean = false
  ): Promise<{ students: Student[]; totalPages: number }> {
    const count = await StudentModel.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    const sortCriteria: any = isClassFiltered
      ? { rank: 1 } // Sort by rank first, then admission number
      : { admissionNo: 1 }; // Default sort by admission number only

    const students = await StudentModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortCriteria)
      .populate("classId name");
    return {
      students: students.map(
        (student) => new Student(student.toObject() as Student)
      ),
      totalPages: totalPages,
    };
  }

  async findByLevel(level: string, className?: string): Promise<Student[]> {
    const students = await StudentModel.find({ isDeleted: false });

    return students.map(
      (student) => new Student(student.toObject() as Student)
    );
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

  async deleteExtraScore(id: string): Promise<Boolean> {
    const result = await StudentModel.updateOne(
      { "extraMarks._id": id },
      { $pull: { extraMarks: { _id: id } } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Extra mark not found or already deleted");
    }

    return true;
  }

  async editExtraScore(
    id: string,
    mark: number,
    description: string
  ): Promise<void> {
    const result = await StudentModel.updateOne(
      { "extraMarks._id": id },
      {
        $set: {
          "extraMarks.$.mark": mark,
          "extraMarks.$.description": description,
        },
      }
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
  ): Promise<{ student: Student; addedMark: any; finalProgramName: string }> {
    const updateData: any = { academicYear, mark, description };
    let addedMark;
    let finalProgramName = "";
    if (mongoose.Types.ObjectId.isValid(programName)) {
      updateData.programId = programName;
      const item = await ExtraMarkItemModel.findById(programName);
      if (!item) {
        throw new Error("Invalid program name");
      }
      finalProgramName = item.item;
    } else {
      updateData.customProgramName = programName;
      finalProgramName = programName;
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
    if (updatedStudent.extraMarks) {
      addedMark =
        updatedStudent.extraMarks[updatedStudent.extraMarks.length - 1];
    }
    return {
      student: new Student(updatedStudent.toObject() as Student),
      addedMark,
      finalProgramName,
    };
  }

  async addMentorScore(
    id: string,
    academicYear: string,
    mark: number,
    semester: string
  ): Promise<{ student: Student; addedMark: any }> {
    let addedMark;
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
    if (updatedStudent.mentorMarks) {
      addedMark = updatedStudent.mentorMarks.find(
        (entry) =>
          entry.academicYear === academicYear && entry.semester === semester
      );
    }

    return {
      student: new Student(updatedStudent.toObject() as Student),
      addedMark,
    };
  }
  async addCceScore(
    id: string,
    academicYear: string,
    semester: string,
    classId: string,
    subjectName: string,
    phase: string,
    mark: number
  ): Promise<{ student: Student; addedMark: any }> {
    // Helper to normalize strings
    const normalize = (val: string) => val.trim().toLowerCase();

    // Fetch class name from DB and normalize
    const classDoc = await classModel.findById(classId).select("name");
    const className = classDoc?.name?.trim();

    if (!className) throw new Error("Class not found");

    const academicYearNorm = normalize(academicYear);
    const semesterNorm = normalize(semester);
    const classNameNorm = normalize(className);

    // Validate student and ensure student is in the class
    const student = await StudentModel.findById(id).select("classId cceMarks");

    if (!student) throw new Error("Student not found");
    if (student.classId.toString() !== classId.toString()) {
      throw new Error("This student is not in this class");
    }

    // Normalize student records to check for existing entry manually
    const existingRecord = student.cceMarks?.find(
      (record: any) =>
        normalize(record.academicYear) === academicYearNorm &&
        normalize(record.semester) === semesterNorm &&
        normalize(record.className) === classNameNorm
    );

    let updateOp;
    let arrayFilters: any[] = [];

    if (existingRecord) {
      // Check if subject + phase already exists
      const subjectExists = existingRecord.subjects?.some(
        (sub: any) =>
          normalize(sub.subjectName) === normalize(subjectName) &&
          normalize(sub.phase) === normalize(phase)
      );

      if (subjectExists) {
        // ✅ Update existing mark
        updateOp = {
          $set: {
            "cceMarks.$[record].subjects.$[subject].mark": mark,
          },
        };
        arrayFilters = [
          {
            "record.academicYear": academicYear,
            "record.semester": semester,
            "record.className": className,
          },
          {
            "subject.subjectName": subjectName,
            "subject.phase": phase,
          },
        ];
      } else {
        // ✅ Push new subject entry to existing record
        updateOp = {
          $push: {
            "cceMarks.$[record].subjects": {
              subjectName,
              phase,
              mark,
              date: new Date(),
            },
          },
        };
        arrayFilters = [
          {
            "record.academicYear": academicYear,
            "record.semester": semester,
            "record.className": className,
          },
        ];
      }
    } else {
      // ✅ No record exists for this academicYear + semester + className
      updateOp = {
        $push: {
          cceMarks: {
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
          },
        },
      };
    }

    // Apply the update
    const updatedStudent = await StudentModel.findOneAndUpdate(
      { _id: id },
      updateOp,
      {
        arrayFilters,
        new: true,
      }
    );

    if (!updatedStudent) throw new Error("Failed to update student record");

    // Get the added mark entry to return
    const updatedRecord = updatedStudent.cceMarks?.find(
      (r) =>
        r.academicYear === academicYear &&
        r.semester === semester &&
        r.className === className
    );

    const addedMark = updatedRecord?.subjects.find(
      (s) => s.subjectName === subjectName && s.phase === phase
    );

    return {
      student: new Student(updatedStudent.toObject() as Student),
      addedMark,
    };
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
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      {
        $unwind: "$classInfo",
      },
      {
        $addFields: {
          totalSubjects: { $size: "$classInfo.subjects" },
          totalMaxMarks: {
            $add: [
              100,
              {
                $multiply: [
                  { $subtract: [{ $size: "$classInfo.subjects" }, 1] },
                  30,
                ],
              },
            ],
          },
          scoredMarks: {
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
                  $sum: "$$ccef.subjects.mark",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalCceScore: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$scoredMarks", "$totalMaxMarks"] },
                  100,
                ],
              },
              0,
            ],
          },
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
              { $ifNull: ["$totalPenaltyMark", 0] },
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
        $project: {
          name: 1,
          performanceScore: 1,
          classId: "$classInfo",
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
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      {
        $unwind: "$classInfo",
      },
      {
        $addFields: {
          totalSubjects: { $size: "$classInfo.subjects" },
        },
      },
      {
        $addFields: {
          totalMaxMarks: {
            $add: [
              100,
              {
                $multiply: [{ $subtract: ["$totalSubjects", 1] }, 30],
              },
            ],
          },
          scoredMarks: {
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
                  $sum: "$$ccef.subjects.mark",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalCceScore: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$scoredMarks", "$totalMaxMarks"] },
                  100,
                ],
              },
              0,
            ],
          },
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
        $project: {
          name: 1,
          performanceScore: 1,
          profileImage: 1,
          classId: "$classInfo",
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
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      {
        $unwind: "$classInfo",
      },
      {
        $addFields: {
          totalSubjects: { $size: "$classInfo.subjects" },
        },
      },
      {
        $addFields: {
          totalMaxMarks: {
            $add: [
              100,
              {
                $multiply: [{ $subtract: ["$totalSubjects", 1] }, 30],
              },
            ],
          },
          scoredMarks: {
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
                  $sum: "$$ccef.subjects.mark",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalCceScore: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$scoredMarks", "$totalMaxMarks"] },
                  100,
                ],
              },
              0,
            ],
          },
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
        $project: {
          name: 1,
          performanceScore: 1,
          profileImage: 1,
          classId: "$classInfo",
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
                $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceScore"],
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

  async findByClass(classId: string, top?: number): Promise<Student[]> {
    const filter: any = {
      isDeleted: false,
    };

    if (classId) {
      filter.classId = classId;
    }

    let query = StudentModel.find(filter).sort({ rank: 1 }).populate("classId");
    if (top) {
      query = query.limit(top);
    }
    const students = await query;
    return students.map((item) => item.toObject() as Student);
  }
  async findAll(): Promise<Student[]> {
    const filter: any = {
      isDeleted: false,
    };
    let query = StudentModel.find(filter).populate("classId");
    const students = await query;
    return students.map((item) => item.toObject() as Student);
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
  ): Promise<{ student: Student; addedMark: any }> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("student not found");
    }
    let addedMark;
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
    if (updatedStudent.penaltyMarks) {
      addedMark =
        updatedStudent.penaltyMarks[updatedStudent.penaltyMarks.length - 1];
    }
    return {
      student: new Student(updatedStudent.toObject() as Student),
      addedMark,
    };
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
