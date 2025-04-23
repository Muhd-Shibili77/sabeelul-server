import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { Request,Response } from "express";
export class AdminController {
    constructor(private adminUseCase: AdminUseCase) {}
    async fetchTeachers(req: Request, res: Response) {
        try {
            const search: string = (req.query.search as string) || "";
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;

            const query = search
            ? {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { registerNo: { $regex: search, $options: "i" } }
                ]
              }
            : {};
          

            const {teachers,totalPages} = await this.adminUseCase.fetchTeachers(query,page,limit)
            res.status(200).json({ success: true,message:'Fetching of teacher is successfull', data: teachers, totalPages:totalPages });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
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


            const {students,totalPages} = await this.adminUseCase.fetchStudents(query,page,limit)
            res.status(200).json({ success: true,message:'Fetching of student is successfull', data: students, totalPages:totalPages });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addTeacher(req: Request, res: Response) {
        try {
            const { name,phone,address, email, password, registerNumber,profile } = req.body;
            const newTeacher = await this.adminUseCase.addTeacher(name,phone,address, email, password, registerNumber,profile)
            res.status(200).json({ success: true,message:'Adding of teacher is successfull', data: newTeacher });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async addStudent(req: Request, res: Response) {
        try {
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const newStudent = await this.adminUseCase.addStudent(admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(200).json({ success: true,message:'Adding of student is successfull', data: newStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteTeacher(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            await this.adminUseCase.deleteTeacher(id);
            res.status(200).json({ success: true,message:'Deleting of teacher is successfull' });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            await this.adminUseCase.deleteStudent(id);
            res.status(200).json({ success: true,message:'Deleting of student is successfull' });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateTeacher(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const { name,phone,address, email, password, registerNumber,profile } = req.body;
            const updatedTeacher = await this.adminUseCase.updateTeacher(id,name,phone,address, email, password, registerNumber,profile)
            res.status(200).json({ success: true,message:'Updating of teacher is successfull', data: updatedTeacher });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const updatedStudent = await this.adminUseCase.updateStudent(id,admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(200).json({ success: true,message:'Updating of student is successfull', data: updatedStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async fetchClass(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            const query = search
            ? {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { isDeleted:false }
                ]
              }
            : {};

            const result = await this.adminUseCase.fetchClasses(query, page, limit);
            res.status(200).json({ success: true,message:'Fetching of classes is successfull', data: result.classes, totalPages:result.totalPages ?? undefined });

            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

   

    async addClass(req:Request,res:Response){
        try {
            const {name,subjects} = req.body
            const newClass = await this.adminUseCase.addClass(name,subjects)
            res.status(200).json({ success: true,message:'Adding of class is successfull', data: newClass });

            
        }  catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateClass(req:Request,res:Response){
        try {
            const id :string = req.params.id;
            const {name,subjects}=req.body
            const updatedClass = await this.adminUseCase.updateClass(id,name,subjects)
            res.status(200).json({ success: true,message:'Updating of class is successfull', data: updatedClass });
        }  catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteClass(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            await this.adminUseCase.deleteClass(id)
            res.status(200).json({ success: true,message:'Deleting of class is successfull' });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async fetchProgram(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            const query = search
            ? {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { isDeleted:false }
                ]
              }
            : {};

            const result = await this.adminUseCase.fetchPrograms(query, page, limit);
            res.status(200).json({ success: true,message:'Fetching of programs is successfull', data: result.programs, totalPages:result.totalPages ?? undefined });

            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async addProgram(req:Request,res:Response){
        try {
            const {name,startDate,endDate,criteria,classes} = req.body
            const newProgram = await this.adminUseCase.addProgram(name,startDate,endDate,criteria,classes)
            res.status(200).json({ success: true,message:'Adding of program is successfull', data: newProgram });

            
        }  catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateProgram(req:Request,res:Response){
        try {
            const id :string = req.params.id;
            const {name,startDate,endDate,criteria,classes} = req.body
            const updatedProgram = await this.adminUseCase.updateProgram(id,name,startDate,endDate,criteria,classes)
            res.status(200).json({ success: true,message:'Updating of program is successfull', data: updatedProgram });
        }  catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteProgram(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            await this.adminUseCase.deleteProgram(id)
            res.status(200).json({ success: true,message:'Deleting of program is successfull' });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}