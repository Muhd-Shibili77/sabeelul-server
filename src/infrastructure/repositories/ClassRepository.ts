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
        const updatedClass = await ClassModel.findByIdAndUpdate(id, classData, { new: true });
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
        const cls = await ClassModel.findById(id);
        if (!cls) {
            return null;
        }
        return new Class(cls.toObject() as Class);
    }

    async fetchClasses(query: object, page?: number, limit?: number): Promise<{ classes: Class[]; totalPages?: number }> {
        if (page && limit) {
           
            const count = await ClassModel.countDocuments(query);
            const totalPages = Math.ceil(count / limit);
            const classes = await ClassModel.find(query)
              .skip((page - 1) * limit)
              .limit(limit)
              .sort({ name: 1 });
      
            return {
              classes: classes.map(
                (classData) => new Class(classData.toObject() as Class)
              ),
              totalPages,
            };
          } else {
            const classes = await ClassModel.find(query).sort({ name: 1 });
            return {
              classes: classes.map(
                (classData) => new Class(classData.toObject() as Class)
              ),
            };
          }
    }

    async addScore(id: string, academicYear: string, item: string, score: number): Promise<Class> {
        const cls = await ClassModel.findById(id);
        if (!cls) {
            throw new Error("Class not found");
        }
        const updatedClass = await ClassModel.findByIdAndUpdate(
            id,
            { $push: { marks: { academicYear, item, score } } },
            { new: true }
        );
        if (!updatedClass) {
            throw new Error("Class add score failed");
        }
        return new Class(updatedClass.toObject() as Class);
    }
    async editScore(id: string, academicYear: string, item: string, score: number): Promise<Class> {
        const cls = await ClassModel.findById(id);
        if (!cls) {
            throw new Error("Class not found");
        }
        const updatedClass = await ClassModel.findOneAndUpdate(
            { _id: id, "marks.academicYear": academicYear, "marks.item": item },
            { $set: { "marks.$.score": score } },
            { new: true }
        );
        if (!updatedClass) {
            throw new Error("Class edit score failed");
        }
        return new Class(updatedClass.toObject() as Class);
    }
    async deleteScore(id: string, academicYear: string, item: string): Promise<Class> {
        const cls = await ClassModel.findById(id);
        if (!cls) {
            throw new Error("Class not found");
        }
        const updatedClass = await ClassModel.findByIdAndUpdate(
            id,
            { $pull: { marks: { academicYear, item } } },
            { new: true }
        );
        if (!updatedClass) {
            throw new Error("Class delete score failed");
        }
        return new Class(updatedClass.toObject() as Class);
    }

    async totalScore(): Promise<Partial<Class>[]> {
        const academicYear = getCurrentAcademicYear()
        const classes = await ClassModel.find(
            {
              'marks.academicYear': academicYear,
              isDeleted: false
            },
            {
              _id: 1,
              name: 1,
              marks: 1
            }
          ).lean();
        
          
          const result = classes.map(cls => ({
            _id: cls._id,
            name: cls.name,
            marks: cls.marks?.filter(mark => mark.academicYear === academicYear)
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
        const existClass = await ClassModel.findOne({name:name,isDeleted:false})
        if(!existClass){
            return null
        }
        return new Class(existClass.toObject() as Class);
         
    }

    async findStudentInClass(id: string): Promise<Student[]> {
        const students = await StudentModel.find({classId:id,isDeleted:false})
        return students.map(student => student.toObject() as Student);
    }
}