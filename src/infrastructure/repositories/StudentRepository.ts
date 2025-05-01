import mongoose,{PipelineStage} from "mongoose";
import { IStudentRepository } from "../../application/interface/IStudentRepository";
import Student from "../../domain/entites/Student";
import StudentModel from "../models/StudentModel";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { ClassPerformance } from "../../domain/types/classPerfromance";
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
    const student = await StudentModel.findById(id);
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
      .sort({ admissionNo: 1 });
    return {
      students: students.map(
        (student) => new Student(student.toObject() as Student)
      ),
      totalPages: totalPages,
    };
  }
  async findByAdNo(admissionNo: string): Promise<Student | null > {
    const student = await StudentModel.findOne({admissionNo:admissionNo})
    if(!student){
       return null
    }
    return new Student(student.toObject() as Student); 
  }
  async addExtraScore(id: string,academicYear:string, programName: string, mark: number): Promise<Student> {
    const updateData: any = { academicYear,mark };
    if (mongoose.Types.ObjectId.isValid(programName)) {
      updateData.programId = programName;
    } else {
      updateData.customProgramName = programName;
    }

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      {
        $push: {
          extraMarks: updateData
        }
      },
      { new: true }
    );
      if(!updatedStudent){
        throw new Error('student add score failed')
      }
      return new Student(updatedStudent.toObject() as Student)
  }

  async addMentorScore(id: string, academicYear: string, mark: number): Promise<Student> {
      const student = await StudentModel.findById(id)
      if(!student){
        throw new Error('student not found')
      }
      const updatedStudent = await StudentModel.findByIdAndUpdate(
        id,
        {$push:{mentorMarks:{academicYear,mark}}},
        {new:true}
      )
      if(!updatedStudent){
        throw new Error('Adding mentor failed')
      }
      return new Student(updatedStudent.toObject() as Student)
  }
  async addCceScore(id: string, academicYear: string, className: string, subjectName: string,phase:string, mark: number): Promise<Student> {
    const student = await StudentModel.findById(id);
    if (!student) {
      throw new Error("Student not found");
     }
    const academicRecord = student.cceMarks?.find(record => record.academicYear === academicYear);

    if(academicRecord){
      academicRecord.subjects.push({
        subjectName,
        phase,
        mark
       });
    }else{
      student.cceMarks?.push({
        academicYear,
        className,
        subjects: [{
            subjectName,
            phase,
            mark
        }]
    });
    }
    await student.save();

    return new Student(student.toObject() as Student)


  }

  async fetchProfile(id: string): Promise<Student> {
      const student = await StudentModel.findById(id).populate('classId').populate('extraMarks.programId').exec();
      return new Student(student?.toObject() as Student)
  }

  async countStudent(): Promise<number> {
    const students = await StudentModel.countDocuments({isDeleted:false})
    return students
  }

  async bestPerfomerClass(): Promise<Student[]> {

    const academicYear = getCurrentAcademicYear()
    const bestStudentsPipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false
        }
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
                    cond: { $eq: ["$$em.academicYear", academicYear] }
                  }
                },
                as: "emf",
                in: "$$emf.mark"
              }
            }
          },
          totalMentorMark: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$mentorMarks",
                    as: "mm",
                    cond: { $eq: ["$$mm.academicYear", academicYear] }
                  }
                },
                as: "mmf",
                in: "$$mmf.mark"
              }
            }
          },
          totalCceScore: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cceMarks",
                    as: "cce",
                    cond: { $eq: ["$$cce.academicYear", academicYear] }
                  }
                },
                as: "ccef",
                in: {
                  $sum: {
                    $map: {
                      input: "$$ccef.subjects",
                      as: "sub",
                      in: {
                        $multiply: ["$$sub.mark", 0.2]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          performanceScore: {
            $add: ["$totalExtraMark", "$totalMentorMark", "$totalCceScore"]
          }
        }
      },
      {
        $sort: { classId: 1, performanceScore: -1 }
      },
      {
        $group: {
          _id: "$classId",
          bestStudent: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$bestStudent" }
      },
      {
        $lookup: {
          from: "classes", // replace with your actual collection name for classes
          localField: "classId",
          foreignField: "_id",
          as: "classId"
        }
      },
      {
        $unwind: "$classId"
      },
      {
        $project: {
          name: 1,
          performanceScore: 1,
          classId: 1 // now this will contain the populated class object
        }
      }
    ];
    

    const result = await StudentModel.aggregate(bestStudentsPipeline);
    return result 
  }



async getBestPerformingClass():Promise<ClassPerformance[]> {
  const academicYear = getCurrentAcademicYear();

  const result = await StudentModel.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: 'classes',
        localField: 'classId',
        foreignField: '_id',
        as: 'classInfo',
      },
    },
    {
      $unwind: {
        path: '$classInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$extraMarks',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$mentorMarks',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$cceMarks',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$cceMarks.subjects',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        extraMark: {
          $cond: [
            { $eq: ['$extraMarks.academicYear', academicYear] },
            { $ifNull: ['$extraMarks.mark', 0] },
            0,
          ],
        },
        mentorMark: {
          $cond: [
            { $eq: ['$mentorMarks.academicYear', academicYear] },
            { $ifNull: ['$mentorMarks.mark', 0] },
            0,
          ],
        },
        cceMark: {
          $cond: [
            { $eq: ['$cceMarks.academicYear', academicYear] },
            {
              $multiply: [
                { $ifNull: ['$cceMarks.subjects.mark', 0] },
                0.2,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          studentId: '$_id',
          classId: '$classId',
          className: '$classInfo.name',
        },
        totalExtraMark: { $sum: '$extraMark' },
        totalMentorMark: { $sum: '$mentorMark' },
        totalCceMark: { $sum: '$cceMark' },
        classInfo: { $first: '$classInfo' },
      },
    },
    {
      $addFields: {
        studentTotalScore: {
          $add: ['$totalExtraMark', '$totalMentorMark', '$totalCceMark'],
        },
      },
    },
    {
      $group: {
        _id: '$_id.classId',
        className: { $first: '$_id.className' },
        totalStudentScore: { $sum: '$studentTotalScore' },
        classInfo: { $first: '$classInfo' },
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
                      input: '$classInfo.marks',
                      as: 'm',
                      cond: { $eq: ['$$m.academicYear', academicYear] },
                    },
                  },
                  as: 'filteredMark',
                  in: '$$filteredMark.score',
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
          $add: ['$totalStudentScore', '$classScore'],
        },
      },
    },
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $project: {
        _id: 0,
        classId: '$_id',
        className: 1,
        totalStudentScore: 1,
        classScore: 1,
        totalScore: 1,
      },
    },
   
  ]);

  return result; 
}

}
