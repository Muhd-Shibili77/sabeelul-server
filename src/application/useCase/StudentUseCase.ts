import Program from "../../domain/entites/Program";
import Student from "../../domain/entites/Student";
import { getCurrentAcademicYear } from "../../shared/utils/AcademicYr";
import { IStudentRepository } from "../interface/IStudentRepository";
import { IMarkLogRepository } from "../interface/IMarkLogRepository";
import bcrypt from "bcrypt";
import validator from "validator";
import ExtraMarkItem from "../../domain/entites/ExtraMarkItem";

interface SubjectMark {
  subjectName: string;
  phase: string;
  mark: number;
}

export class StudentUseCase {
  constructor(private studentRepository: IStudentRepository,private markLogsRepository : IMarkLogRepository) {}

  async fetchStudents(query: object, page: number, limit: number) {
    const students = await this.studentRepository.fetchStudents(
      query,
      page,
      limit
    );
    return students;
  }

  async addStudent(
    admissionNo: string,
    name: string,
    phone: number,
    email: string,
    password: string,
    className: string,
    address: string,
    guardianName: string,
    profile: string
  ): Promise<Student> {
    if (
      !name ||
      !email ||
      !password ||
      !admissionNo ||
      !address ||
      !phone ||
      !guardianName ||
      !className
    ) {
      throw new Error("All required fields must be filled.");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    const phoneStr = phone.toString();
    if (!/^[0-9]{10}$/.test(phoneStr)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
    const isExist = await this.studentRepository.isExist(email);
    if (isExist) {
      throw new Error("Email already exist");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      admissionNo: admissionNo,
      name,
      phone,
      address,
      email,
      password: hashedPassword,
      classId: className,
      guardianName,
      profileImage: profile,
    });

    const newStudent = await this.studentRepository.addStudent(student);
    return newStudent;
  }
  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentRepository.findStudentById(id);
    if (!student) {
      throw new Error("Student not found.");
    }
    if (student.isDeleted) {
      throw new Error("Student already deleted.");
    }
    await this.studentRepository.deleteStudent(id);
  }

  async updateStudent(
    id: string,
    admissionNo: string,
    name: string,
    phone: number,
    email: string,
    password: string,
    className: string,
    address: string,
    guardianName: string,
    profile: string
  ): Promise<Student> {
    if (!name) {
      throw new Error("Name is required.");
    }

    if (!email) {
      throw new Error("Email is required.");
    }

    if (!admissionNo) {
      throw new Error("Admission number is required.");
    }

    if (!address) {
      throw new Error("Address is required.");
    }

    if (!phone) {
      throw new Error("Phone number is required.");
    }

    if (!guardianName) {
      throw new Error("Guardian name is required.");
    }

    if (!className) {
      throw new Error("Class is required.");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    const phoneStr = phone.toString();
    if (!/^[0-9]{10}$/.test(phoneStr)) {
      throw new Error("Phone number must be exactly 10 digits.");
    }
    if (password != "" && password.length < 5) {
      throw new Error("Password must be at least 5 characters long.");
    }
    // const isExist = await this.studentRepository.isExist(email);
    // if (isExist) {
    //   throw new Error("Email already exist");
    // }

    const existStudent = await this.studentRepository.findStudentById(id);
    let hashedPassword = existStudent?.password;
    if (password != "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const student = new Student({
      admissionNo: admissionNo,
      name,
      phone,
      address,
      email,
      password: hashedPassword,
      classId: className,
      guardianName,
      profileImage: profile,
    });

    const updatedStudent = await this.studentRepository.updateStudent(
      id,
      student
    );
    return updatedStudent;
  }

  async findByAdmissinNo(admissionNo: string): Promise<Student> {
    if (!admissionNo) {
      throw new Error("AdmissionNo required");
    }

    const student = await this.studentRepository.findByAdNo(admissionNo);

    if (!student) {
      throw new Error("student not found");
    }

    return student;
  }
  async addExtraScore(
    id: string,
    programName: string,
    mark: number,
    description: string
  ): Promise<Student> {
    const academicYear = getCurrentAcademicYear();
    if (!id) {
      throw new Error("id is required");
    }
    if (!academicYear) {
      throw new Error("academicYear is required");
    }
    if (!programName) {
      throw new Error("programName is required");
    }
    if (!mark) {
      throw new Error("mark is required");
    }
    if (mark <= 0) {
      throw new Error("mark is must be greater than zero");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }
    const student = await this.studentRepository.addExtraScore(
      id,
      academicYear,
      programName,
      mark,
      description
    );
    if (!student) {
      throw new Error("score is not updated to student");
    }
    return student;
  }
  async deleteExtraScore(id: string) {
    if (!id) {
      throw new Error("id is required");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }
    const student = await this.studentRepository.deleteExtraScore(id);
    return student;
  }
  async editExtraScore(id: string, mark: number) {
    if (!id) {
      throw new Error("id is required");
    }
    if (!mark) {
      throw new Error("mark is required");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }
    const student = await this.studentRepository.editExtraScore(id, mark);
    return student;
  }

  async addMentorScore(id: string, mark: number): Promise<Student> {
    const academicYear = getCurrentAcademicYear();
    if (!id) {
      throw new Error("id is required");
    }
    if (!academicYear) {
      throw new Error("academicYear is required");
    }
    if (!mark) {
      throw new Error("mark is required");
    }
    if (mark <= 0) {
      throw new Error("mark is must be greater than zero");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }
    const student = await this.studentRepository.addMentorScore(
      id,
      academicYear,
      mark
    );
    if (!student) {
      throw new Error("Adding mentor failed");
    }
    
    const recentInput = await this.markLogsRepository.addMarkLog(
      id,
      academicYear,
      "Mentor Score",
      mark,
      "Mentor"
    );
    if (!recentInput) {
      throw new Error("Adding mentor log failed");
    }
    return student;
  }

  async addCceScore(
    id: string,
    classId: string,
    phase: string,
    subjectName: string,
    mark: number
  ): Promise<Student> {
    const academicYear = getCurrentAcademicYear();
    if (!id) {
      throw new Error("id is required");
    }
    if (!academicYear) {
      throw new Error("academicYear is required");
    }
    if (!classId) {
      throw new Error("className is required");
    }
    if (!subjectName) {
      throw new Error("subjectName is required");
    }
    if (!phase) {
      throw new Error("phase is required");
    }
    if (!mark) {
      throw new Error("mark is required");
    }
    if (mark <= 0) {
      throw new Error("mark is must be greater than zero");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }

    const updatedStudent = await this.studentRepository.addCceScore(
      id,
      academicYear,
      classId,
      phase,
      subjectName,
      mark
    );
    if (!updatedStudent) {
      throw new Error("Failed to add CCE mark to student");
    }
    return updatedStudent;
  }
  async fetchProfile(id: string) {
    if (!id) {
      throw new Error("id is required");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }
    const student = await this.studentRepository.fetchProfile(id);
    if (student.isDeleted) {
      throw new Error("student is deleted");
    }
    return student;
  }

  async dashboard(id: string) {
    if (!id) {
      throw new Error("id is required");
    }
    const student = await this.studentRepository.fetchProfile(id);
    if (student.isDeleted) {
      throw new Error("student is deleted");
    }
    const academicYear = getCurrentAcademicYear();

    // Filter extraMarks by academic year and find latest (assuming order is not guaranteed)
    const filteredExtraMarks = student.extraMarks
      ?.filter((e) => e.academicYear === academicYear)
      .sort((a, b) => b.mark - a.mark); // sort by mark, or add timestamp if available

    const latestExtra = filteredExtraMarks?.[0];

    let latestAchievement = null;
    if (latestExtra) {
      const name =
        latestExtra.programId && typeof latestExtra.programId === "object"
          ? (latestExtra.programId as ExtraMarkItem).item
          : latestExtra.customProgramName || null;
      const mark = latestExtra.mark || 0;
      const date = latestExtra.date || null;
      latestAchievement = {
        name,
        mark,
        date,
      };
    }

    let cceMarkTotal = 0;
    if (student.cceMarks?.length) {
      student.cceMarks
        .filter((cce) => cce.academicYear === academicYear)
        .forEach((cce) => {
          cce.subjects?.forEach((subject) => {
            if (subject.mark) {
              cceMarkTotal += Math.round(subject.mark * 0.2);
            }
          });
        });
    }

    const mentorMarkTotal =
      student.mentorMarks
        ?.filter((m) => m.academicYear === academicYear)
        .reduce((sum, m) => sum + (m.mark || 0), 0) || 0;

    const extraMarkTotal = Math.round(
      student.extraMarks
        ?.filter((e) => e.academicYear === academicYear)
        .reduce((sum, e) => sum + (e.mark || 0), 0) || 0
    );

    const totalMarks = Math.round(
      cceMarkTotal + mentorMarkTotal + extraMarkTotal + 200
    );

    const details = {
      name: student.name,
      profileImage: student.profileImage,
      class: student.classId,
      marks: totalMarks,
      latestAchievement: latestAchievement,
    };

    return details;
  }

  async performance(id: string) {
    if (!id) {
      throw new Error("id is required");
    }
    const student = await this.studentRepository.fetchProfile(id);
    if (student.isDeleted) {
      throw new Error("student is deleted");
    }
    const academicYear = getCurrentAcademicYear();

    let cceMarkTotal = 0;
    const subjectWiseMarks: SubjectMark[] = [];

    if (student.cceMarks?.length) {
      student.cceMarks
        .filter((cce) => cce.academicYear === academicYear)
        .forEach((cce) => {
          cce.subjects?.forEach((subject) => {
            if (subject.mark) {
              const calculatedMark = Math.round(subject.mark * 0.2);
              cceMarkTotal += calculatedMark;

              // Store individual subject marks
              subjectWiseMarks.push({
                subjectName: subject.subjectName,
                phase: subject.phase,
                mark: subject.mark,
              });
            }
          });
        });
    }

    const mentorMarkTotal =
      student.mentorMarks
        ?.filter((m) => m.academicYear === academicYear)
        .reduce((sum, m) => sum + (m.mark || 0), 0) || 0;

    const extraMarkTotal = Math.round(
      student.extraMarks
        ?.filter((e) => e.academicYear === academicYear)
        .reduce((sum, e) => sum + (e.mark || 0), 0) || 0
    );

    const totalMarks = Math.round(
      cceMarkTotal + mentorMarkTotal + extraMarkTotal + 200
    );

    // Filter and map all extraMarks in this academic year
    const achievementDetails =
      student.extraMarks
        ?.filter((e) => e.academicYear === academicYear)
        .map((e) => {
          let name: string | null = null;

          if (e.programId && typeof e.programId === "object") {
            name = (e.programId as ExtraMarkItem).item;
          } else if (e.customProgramName) {
            name = e.customProgramName;
          }

          return {
            name,
            mark: e.mark,
            date: e.date,
          };
        }) || [];

    const details = {
      totalScore: totalMarks,
      cceScore: cceMarkTotal,
      creditScore: extraMarkTotal,
      mentorMark:mentorMarkTotal,
      subjectWiseMarks: subjectWiseMarks, // Added subject-wise marks
      achievements: achievementDetails, // Fixed the typo in the property name
    };

    return details;
  }

  async fetchByClass(classId: string) {
    if (!classId) {
      throw new Error("class id is required");
    }
    const students = await this.studentRepository.findByClass(classId);

    return students;
  }
  async addPenaltyScore(id:string,reason:string,penaltyScore:number,description:string):Promise<Student>{
    const academicYear = getCurrentAcademicYear();
    const student = await this.studentRepository.findStudentById(id)
    if (!student) {
      throw new Error("student not found");
    }
    const updateClass = await this.studentRepository.addPenaltyScore(id,academicYear,reason,penaltyScore,description)
    return updateClass
  }
  async editPenaltyScore(id:string,markId:string,reason:string,penaltyScore:number,description:string):Promise<Student>{
    const student = await this.studentRepository.findStudentById(id)
    if (!student) {
      throw new Error("student not found");
    }
    const updateClass = await this.studentRepository.editPenaltyScore(id,markId,reason,penaltyScore,description)
    return updateClass
  }
  async deletePenaltyScore(id: string, markId: string):Promise<void>{
    const student = await this.studentRepository.findStudentById(id)
    if (!student) {
      throw new Error("student not found");
    }
    const updatedClass = await this.studentRepository.deletePenaltyScore(id,markId)
    return updatedClass
  }
}
