import { StudentUseCase } from "../../application/useCase/StudentUseCase";
import { Request, Response } from "express";
import { StatusCode } from "../../application/constants/statusCode";
export class StudentController {
  constructor(private studentUsecase: StudentUseCase) {}

  async fetchStudents(req: Request, res: Response) {
    try {
      const search: string = (req.query.search as string) || "";
      const className: string = (req.query.class as string) || "";
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;

      let query: any = { isDeleted: false };

      // Add search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { admissionNo: { $regex: search, $options: "i" } },
        ];
      }

      if (className.toLowerCase()) {
        query.classId = className;
      }

      const { students, totalPages } = await this.studentUsecase.fetchStudents(
        query,
        page,
        limit,
        !!className
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of student is successfull",
        students,
        totalPages: totalPages,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async fetchByLevel(req: Request, res: Response) {
    try {
      const level: string = req.query.level as string;
      const className: string = (req.query.class as string) || "";
      const students = await this.studentUsecase.fetchByLevel(level, className);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of students by level is successfull",
        students,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async fetchStudentsByClass(req: Request, res: Response) {
    try {
      const classId: string = (req.query.classId as string) || "";
      const top: number | undefined = req.query.top
        ? parseInt(req.query.top as string)
        : undefined;
      const students = await this.studentUsecase.fetchStudentsByClass(
        classId,
        top
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Fetching of students by class is successfull",
        students,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async fetchMentorScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const student = await this.studentUsecase.fetchMentorScore(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching mentor score is successfull",
        students: student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async fetchPkvScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const student = await this.studentUsecase.fetchPKVScore(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching pkv score is successfull",
        students: student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addStudent(req: Request, res: Response) {
    try {
      const {
        admissionNo,
        rank,
        name,
        phone,
        email,
        password,
        className,
        address,
        guardianName,
        profile,
      } = req.body;
      const newStudent = await this.studentUsecase.addStudent(
        admissionNo,
        rank,
        name,
        phone,
        email,
        password,
        className,
        address,
        guardianName,
        profile
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Adding of student is successfull",
        students: newStudent,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteStudent(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      await this.studentUsecase.deleteStudent(id);
      res
        .status(StatusCode.OK)
        .json({ success: true, message: "Deleting of student is successfull" });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async updateStudent(req: Request, res: Response) {
    try {
      const id: string = req.params.id;

      const {
        admissionNo,
        rank,
        name,
        phone,
        email,
        password,
        className,
        address,
        guardianName,
        profile,
      } = req.body;
      const updatedStudent = await this.studentUsecase.updateStudent(
        id,
        admissionNo,
        rank,
        name,
        phone,
        email,
        password,
        className,
        address,
        guardianName,
        profile
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Updating of student is successfull",
        data: updatedStudent,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async findByAdmNo(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const student = await this.studentUsecase.findByAdmissinNo(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching of student is successfull",
        student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addExtraScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { programName, mark, discription } = req.body;
      const student = await this.studentUsecase.addExtraScore(
        id,
        programName,
        mark,
        discription
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "add Extra mark to student is successfull",
        data: student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deleteStudentExtraScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;

      const { userId } = req.body;
      await this.studentUsecase.deleteExtraScore(id, userId);
      res.status(StatusCode.OK).json({
        success: true,
        message: "delete Extra mark to student is successfull",
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async editStudentExtraScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { mark, description, userId } = req.body;
      await this.studentUsecase.editExtraScore(id, mark, description, userId);
      res.status(StatusCode.OK).json({
        success: true,
        message: "edit Extra mark to student is successfull",
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async addMentorScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;

      const { mark, semester } = req.body;
      const student = await this.studentUsecase.addMentorScore(
        id,
        mark,
        semester
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "add mentor mark to student is successful",
        data: student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addCceScore(req: Request, res: Response) {
    try {
      const payload: {
        id: string;
        data: {
          classId: string;
          semester: string;
          subjectName: string;
          phase: string;
          mark: number;
        };
      }[] = req.body;

      const results = await Promise.all(
        payload.map(({ id, data }) =>
          this.studentUsecase.addCceScore(
            id,
            data.classId,
            data.semester,
            data.subjectName,
            data.phase,
            data.mark
          )
        )
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Batch CCE marks added successfully",
        data: results,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async addPkvScore(req: Request, res: Response) {
    try {
      const payload: {
        id: string;
        data: {
          semester: string;
          mark: number;
        };
      }[] = req.body;

      const results = await Promise.all(
        payload.map(({ id, data }) =>
          this.studentUsecase.addPkvScore(
            id,
            data.semester,
            data.mark
          )
        )
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Batch PKV marks added successfully",
        data: results,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async fetchCCEMark(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const student = await this.studentUsecase.fetchCCEMark(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching profile successfull",
        data: student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async fetchProfile(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const student = await this.studentUsecase.fetchProfile(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching profile successfull",
        student,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async dashboard(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const dashboard = await this.studentUsecase.dashboard(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching dashboard successfull",
        dashboard,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async performance(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const performance = await this.studentUsecase.performance(id);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching performance details successfull",
        performance,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async fetchByClass(req: Request, res: Response) {
    try {
      const classId: string = req.params.id || "";
      const students = await this.studentUsecase.fetchByClass(classId);
      res.status(StatusCode.OK).json({
        success: true,
        message: "fetching students successfull",
        students,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async addPenaltyScore(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const { reason, penaltyScore, description } = req.body;
      const updatedStudent = await this.studentUsecase.addPenaltyScore(
        id,
        reason,
        penaltyScore,
        description
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Adding of penalty score is successfull",
        data: updatedStudent,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async editPenaltyScore(req: Request, res: Response) {
    try {
      const { reason, description, penaltyScore, markId } = req.body;

      // Access values like this:
      const id: string = req.params.id;
      const updatedStudent = await this.studentUsecase.editPenaltyScore(
        id,
        markId,
        reason,
        penaltyScore,
        description
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Editing of penalty score is successfull",
        data: updatedStudent,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async deletePenaltyScore(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { markId } = req.body;
      const updatedStudent = await this.studentUsecase.deletePenaltyScore(
        id,
        markId
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Deleting of penalty score is successfull",
        data: updatedStudent,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}
