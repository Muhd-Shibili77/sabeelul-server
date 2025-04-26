import { StudentUseCase } from "../../application/useCase/StudentUseCase";
import { Request,Response } from "express";

export class StudentController{
    constructor(private studentUsecase : StudentUseCase){}

    async fetchStudents(req: Request, res: Response) {
        try {
            const search: string = (req.query.search as string) || "";
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;

            const query = search
            ? {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { admissionNo: { $regex: search, $options: "i" } }
                ]
              }
            : {};


            const {students,totalPages} = await this.studentUsecase.fetchStudents(query,page,limit)
            res.status(200).json({ success: true,message:'Fetching of student is successfull', data: students, totalPages:totalPages });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async addStudent(req: Request, res: Response) {
        try {
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const newStudent = await this.studentUsecase.addStudent(admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(200).json({ success: true,message:'Adding of student is successfull', data: newStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            await this.studentUsecase.deleteStudent(id);
            res.status(200).json({ success: true,message:'Deleting of student is successfull' });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const updatedStudent = await this.studentUsecase.updateStudent(id,admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(200).json({ success: true,message:'Updating of student is successfull', data: updatedStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

}