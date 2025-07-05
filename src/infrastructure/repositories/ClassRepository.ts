import mongoose from "mongoose";
import { IClassRepository } from "../../application/interface/IClassRepository";
import Class from "../../domain/entites/Class";
import Student from "../../domain/entites/Student";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import ClassModel from "../models/ClassModel";
import StudentModel from "../models/StudentModel";

export class ClassRepository implements IClassRepository {
  async addClass(classData: Class): Promise<Class> {
    const newClass = new ClassModel(classData);
    await newClass.save();
    return new Class(newClass.toObject() as Class);
  }
  async editClass(id: string, classData: Class): Promise<Class> {
    const updatedClass = await ClassModel.findByIdAndUpdate(id, classData, {
      new: true,
    });
    if (!updatedClass) {
      throw new Error("Class not found");
    }
    return new Class(updatedClass.toObject() as Class);
  }
  async deleteClass(id: string): Promise<void> {
    const cls = await ClassModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!cls) {
      throw new Error("class is not found");
    }
  }
  async findClassById(id: string): Promise<Class | null> {
    const cls = await ClassModel.findById(id).populate("marks.item");
    if (!cls) {
      return null;
    }
    return new Class(cls.toObject() as Class);
  }

  async fetchClasses(
    query: object,
    page?: number,
    limit?: number
  ): Promise<{ classes: Class[]; totalPages?: number }> {
    if (page && limit) {
      const count = await ClassModel.countDocuments(query);
      const totalPages = Math.ceil(count / limit);
      const classes = await ClassModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ name: 1 })
        

      return {
        classes: classes.map(
          (classData) => new Class(classData.toObject() as Class)
        ),
        totalPages,
      };
    } else {
      const classes = await ClassModel.find(query)
        .sort({ name: 1 })
        .populate("marks.item");
      return {
        classes: classes.map(
          (classData) => new Class(classData.toObject() as Class)
        ),
      };
    }
  }

  async addScore(
    id: string,
    academicYear: string,
    item: string,
    score: number,
    description: string
  ): Promise<Class> {
    const cls = await ClassModel.findById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updateData: any = { academicYear, score, description };

    if (mongoose.Types.ObjectId.isValid(item)) {
      updateData.item = item;
    } else {
      updateData.customItem = item;
    }
    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { $push: { marks: updateData } },
      { new: true }
    );
    if (!updatedClass) {
      throw new Error("Class add score failed");
    }
    return new Class(updatedClass.toObject() as Class);
  }
  async editScore(
    id: string,
    markId: string,
    item: string,
    score: number,
    discription: string
  ): Promise<Class> {
    // Step 1: Find the class
    const cls = await ClassModel.findById(id);
    if (!cls) {
      throw new Error("Class not found");
    }

    // Step 2: Check if the mark with given markId exists
    const markExists = cls.marks?.some((m: any) => m._id.toString() === markId);
    if (!markExists) {
      throw new Error("Mark not found in class");
    }

    // Step 3: Update the specific mark
    const updatedClassDoc = await ClassModel.findOneAndUpdate(
      { _id: id, "marks._id": markId },
      {
        $set: {
          "marks.$.score": score,
          "marks.$.item": item,
          "marks.$.description": discription,
        },
      },
      { new: true }
    );

    if (!updatedClassDoc) {
      throw new Error("Failed to update the score");
    }

    // Step 4: Return updated class as Class instance
    return new Class(updatedClassDoc.toObject() as Class);
  }

  async deleteScore(classId: string, markId: string): Promise<void> {
    const cls = await ClassModel.findById(classId);
    if (!cls) {
      throw new Error("Class not found");
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $pull: { marks: { _id: markId } } },
      { new: true }
    );

    if (!updatedClass) {
      throw new Error("Failed to delete score from class");
    }
  }

  async totalScore(): Promise<Partial<Class>[]> {
    const academicYear = getCurrentAcademicYear();
    const classes = await ClassModel.find(
      {
        isDeleted: false,
      },
      {
        _id: 1,
        name: 1,
        marks: 1,
        penaltyMarks: 1,
      }
    ).lean();
    const result = classes.map((cls) => ({
      _id: cls._id,
      name: cls.name,
      marks: cls.marks?.filter((mark) => mark.academicYear === academicYear)||[],
      penaltyMarks: cls.penaltyMarks?.filter((mark) => mark.academicYear === academicYear)||[],
    }));

    return result;
  }

  async addSubject(id: string, subject: string): Promise<void> {
    const existingClass = await ClassModel.findById(id);
    if (!existingClass) throw new Error("Class not found");

    if (existingClass.subjects.includes(subject)) {
      throw new Error("Subject already exists in this class");
    }
    existingClass.subjects.push(subject);
    await existingClass.save();
  }

  async deleteSubject(id: string, subject: string): Promise<void> {
    const existingClass = await ClassModel.findById(id);
    if (!existingClass) throw new Error("Class not found");

    const subjectIndex = existingClass.subjects.indexOf(subject);
    if (subjectIndex === -1) {
      throw new Error("Subject not found in this class");
    }

    existingClass.subjects.splice(subjectIndex, 1);
    await existingClass.save();
  }

  async findClassByName(name: string): Promise<Class | null> {
    const existClass = await ClassModel.findOne({
      name: name,
      isDeleted: false,
    }).populate("marks.item");
    if (!existClass) {
      return null;
    }
    return new Class(existClass.toObject() as Class);
  }

  async findStudentInClass(id: string): Promise<Student[]> {
    const students = await StudentModel.find({ classId: id, isDeleted: false });
    return students.map((student) => student.toObject() as Student);
  }

  async addPenaltyScore(
    id: string,
    academicYear: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Class> {
    const cls = await ClassModel.findById(id);
    if (!cls) {
      throw new Error("Class not found");
    }
    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      {
        $push: {
          penaltyMarks: { academicYear, reason, penaltyScore, description },
        },
      },
      { new: true }
    );
    if (!updatedClass) {
      throw new Error("Class add score failed");
    }
    return new Class(updatedClass.toObject() as Class);
  }

  async editPenaltyScore(
    id: string,
    markId: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Class> {
    const cls = await ClassModel.findById(id);
    if (!cls) {
      throw new Error("Class not found");
    }

    const markExists = cls.penaltyMarks?.some(
      (m: any) => m._id.toString() === markId
    );
    if (!markExists) {
      throw new Error("Penalty Mark not found in class");
    }

    const updatedClassDoc = await ClassModel.findOneAndUpdate(
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
    if (!updatedClassDoc) {
      throw new Error("Failed to update the score");
    }

    // Step 4: Return updated class as Class instance
    return new Class(updatedClassDoc.toObject() as Class);
  }

  async deletePenaltyScore(classId: string, markId: string): Promise<void> {
    const cls = await ClassModel.findById(classId);
    if (!cls) {
      throw new Error("Class not found");
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $pull: { penaltyMarks: { _id: markId } } },
      { new: true }
    );

    if (!updatedClass) {
      throw new Error("Failed to delete score from class");
    }
  }
}
