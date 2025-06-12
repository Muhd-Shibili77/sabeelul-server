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
  semester: string;
  phase: string;
  mark: number;
}

export class StudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private markLogsRepository: IMarkLogRepository
  ) {}

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
    rank: number,
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
      // !email ||
      !password ||
      !admissionNo ||
      // !rank ||
      // !address ||
      // !phone ||
      // !guardianName ||
      !className
    ) {
      throw new Error("All required fields must be filled.");
    }
    if (rank !== undefined && rank !== null && rank <= 0) {
      throw new Error("Rank must be a positive number.");
    }

    // Validate email only if provided
    if (email && email.trim() && !validator.isEmail(email.trim())) {
      throw new Error("Invalid email format.");
    }

    // Validate phone only if provided

    if (
      phone !== undefined &&
      phone !== null &&
      phone.toString().trim() !== ""
    ) {
      const phoneStr = phone.toString();
      if (!/^[0-9]{10}$/.test(phoneStr)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    const admNoExist = await this.studentRepository.findByAdNo(admissionNo);
    if (admNoExist) {
      throw new Error("Adm No already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      admissionNo: admissionNo,
      rank,
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
    rank: number,
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

    if (email && email.trim() && !validator.isEmail(email.trim())) {
      throw new Error("Invalid email format.");
    }

    if (!admissionNo) {
      throw new Error("Admission number is required.");
    }
    if (!rank) {
      throw new Error("Rank is required.");
    }

    if (!className) {
      throw new Error("Class is required.");
    }

    if (
      phone !== undefined &&
      phone !== null &&
      phone.toString().trim() !== ""
    ) {
      const phoneStr = phone.toString();
      if (!/^[0-9]{10}$/.test(phoneStr)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }
    }
    if (password != "" && password.length < 5) {
      throw new Error("Password must be at least 5 characters long.");
    }
    //  const admNoExist = await this.studentRepository.findByAdNo(admissionNo)

    // if(admNoExist?._id != id){
    //   throw new Error('Adm No already exist')
    // }

    const existStudent = await this.studentRepository.findStudentById(id);
    let hashedPassword = existStudent?.password;
    if (password != "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const student = new Student({
      admissionNo: admissionNo,
      rank,
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
    const { student, addedMark, finalProgramName } =
      await this.studentRepository.addExtraScore(
        id,
        academicYear,
        programName,
        mark,
        description
      );
    if (!student) {
      throw new Error("score is not updated to student");
    }
    const logTitle = `Credit Score - ${finalProgramName}`;
    const recentInput = await this.markLogsRepository.addMarkLog(
      id,
      academicYear,
      logTitle,
      mark,
      "Credit",
      addedMark._id
    );
    if (!recentInput) {
      throw new Error("Adding Extra log failed");
    }
    return student;
  }
  async deleteExtraScore(id: string, userId: string) {
    if (!id) {
      throw new Error("id is required");
    }

    const student = await this.studentRepository.deleteExtraScore(id);
    if (!student) {
      throw new Error("Error in deleting extra mark");
    }
    const recentInput = await this.markLogsRepository.deleteMarkLog(userId, id);

    return student;
  }
  async editExtraScore(
    id: string,
    mark: number,
    description: string,
    userId: string
  ) {
    if (!id) {
      throw new Error("id is required");
    }
    if (!mark) {
      throw new Error("mark is required");
    }
    if (!description) {
      throw new Error("description is required");
    }
    if (!userId) {
      throw new Error("userId is required");
    }

    const student = await this.studentRepository.editExtraScore(
      id,
      mark,
      description
    );
    await this.markLogsRepository.updateMarkLog(userId, id, mark);
    return student;
  }

  async addMentorScore(
    id: string,
    mark: number,
    semester: string
  ): Promise<Student> {
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
    if (mark < 0) {
      throw new Error("mark is must be greater than zero");
    }
    if (!semester) {
      throw new Error("semester is required");
    }
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not exist");
    }

    // Check if mentor score already exists for this academic year and semester
    const existingMentorMark = studentExist.mentorMarks?.find(
      (entry) =>
        entry.academicYear === academicYear && entry.semester === semester
    );
    const isUpdate = !!existingMentorMark;

    const { student, addedMark } = await this.studentRepository.addMentorScore(
      id,
      academicYear,
      mark,
      semester
    );
    if (!student) {
      throw new Error("Adding mentor failed");
    }
    const logTitle = `Mentor Score - ${semester}`;

    if (isUpdate && addedMark?._id) {
      // 🔁 Update existing mark log
      await this.markLogsRepository.updateMarkLog(
        id,
        addedMark._id.toString(),
        mark,
        logTitle
      );
    } else {
      // ➕ Add new mark log
      const recentInput = await this.markLogsRepository.addMarkLog(
        id,
        academicYear,
        logTitle,
        mark,
        "Mentor",
        addedMark._id
      );
      if (!recentInput) throw new Error("Adding mentor log failed");
    }
    return student;
  }

  async addCceScore(
    id: string,
    classId: string,
    semester: string,
    phase: string,
    subjectName: string,
    mark: number
  ): Promise<Student> {
    const academicYear = getCurrentAcademicYear();
    if (!id) throw new Error("id is required");
    if (!academicYear) throw new Error("academicYear is required");
    if (!classId) throw new Error("className is required");
    if (!subjectName) throw new Error("subjectName is required");
    if (!phase) throw new Error("phase is required");
    if (mark === undefined || mark === null)
      throw new Error("mark is required");
    if (mark < 0) throw new Error("mark must be greater than zero");
    if (!semester) throw new Error("semester is required");

    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) throw new Error("student not exist");

    // Check total mark for this subject (across all phases)
    const existingCceRecord = studentExist.cceMarks?.find(
      (record) =>
        record.academicYear === academicYear && record.semester === semester
    );

    let existingSubjectPhase: any = null;
    let totalMarkForSubject = 0;
    if (existingCceRecord) {
      const subjectPhases =
        existingCceRecord.subjects?.filter(
          (entry) => entry.subjectName === subjectName
        ) || [];

      // Calculate total mark across all phases for this subject
      totalMarkForSubject = subjectPhases.reduce(
        (acc, entry) => acc + entry.mark,
        0
      );

      // Check if this phase already exists (for update check)
      existingSubjectPhase = subjectPhases.find(
        (entry) => entry.phase === phase
      );
    }

    const isUpdate = !!existingSubjectPhase;

    // If updating an existing phase, subtract its old mark before comparison
    const markAfterUpdate = isUpdate
      ? totalMarkForSubject - existingSubjectPhase.mark + mark
      : totalMarkForSubject + mark;

    if (markAfterUpdate > 30) {
      throw new Error(
        "Total mark for this subject exceeds maximum allowed (30)"
      );
    }

    const { student, addedMark } = await this.studentRepository.addCceScore(
      id,
      academicYear,
      semester,
      classId,
      phase,
      subjectName,
      mark
    );
    if (!student) {
      throw new Error("Failed to add CCE mark to student");
    }
    const logTitle = `CCE Mark - ${subjectName} (${phase}) - ${semester}`;
    if (isUpdate && addedMark?._id) {
      await this.markLogsRepository.updateMarkLog(
        id,
        addedMark._id.toString(),
        mark,
        logTitle
      );
    } else {
      const recentInput = await this.markLogsRepository.addMarkLog(
        id,
        academicYear,
        logTitle,
        mark,
        "CCE",
        addedMark._id
      );
      if (!recentInput) {
        throw new Error("Adding CCE log failed");
      }
    }

    return student;
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

    const penaltyMarkTotal =
      student.penaltyMarks
        ?.filter((p) => p.academicYear === academicYear)
        .reduce((sum, p) => sum + (p.penaltyScore || 0), 0) || 0;

    const totalMarks = Math.round(
      cceMarkTotal + mentorMarkTotal + extraMarkTotal + 200 - penaltyMarkTotal
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
                semester: cce.semester,
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
    const penaltyMarkTotal =
      student.penaltyMarks
        ?.filter((p) => p.academicYear === academicYear)
        .reduce((sum, p) => sum + (p.penaltyScore || 0), 0) || 0;

    const totalMarks = Math.round(
      cceMarkTotal + mentorMarkTotal + extraMarkTotal + 200 - penaltyMarkTotal
    );

    const recentInputs = await this.markLogsRepository.getMarkLogs(
      id,
      academicYear
    );

    const details = {
      totalScore: totalMarks,
      cceScore: cceMarkTotal,
      creditScore: extraMarkTotal,
      mentorMark: mentorMarkTotal,
      penaltyScore: penaltyMarkTotal,
      subjectWiseMarks: subjectWiseMarks, // Added subject-wise marks
      recentInputs: recentInputs, // Fixed the typo in the property name
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
  async addPenaltyScore(
    id: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Student> {
    const academicYear = getCurrentAcademicYear();
    const studentExist = await this.studentRepository.findStudentById(id);
    if (!studentExist) {
      throw new Error("student not found");
    }
    const { student, addedMark } = await this.studentRepository.addPenaltyScore(
      id,
      academicYear,
      reason,
      penaltyScore,
      description
    );
    const logTitle = `Penalty Score - ${reason}`;

    const recentInput = await this.markLogsRepository.addMarkLog(
      id,
      academicYear,
      logTitle,
      penaltyScore,
      "Penalty",
      addedMark._id
    );
    if (!recentInput) {
      throw new Error("Adding penalty log failed");
    }
    return student;
  }
  async editPenaltyScore(
    id: string,
    markId: string,
    reason: string,
    penaltyScore: number,
    description: string
  ): Promise<Student> {
    const student = await this.studentRepository.findStudentById(id);
    if (!student) {
      throw new Error("student not found");
    }
    const updateClass = await this.studentRepository.editPenaltyScore(
      id,
      markId,
      reason,
      penaltyScore,
      description
    );
    const logTitle = `Penalty Score - ${reason}`;
    await this.markLogsRepository.updateMarkLog(
      id,
      markId,
      penaltyScore,
      logTitle
    );

    return updateClass;
  }
  async deletePenaltyScore(id: string, markId: string): Promise<void> {
    const academicYear = getCurrentAcademicYear();
    const student = await this.studentRepository.findStudentById(id);
    if (!student) {
      throw new Error("student not found");
    }
    const updatedClass = await this.studentRepository.deletePenaltyScore(
      id,
      markId
    );
    const recentInput = await this.markLogsRepository.deleteMarkLog(id, markId);

    return updatedClass;
  }
}
