import { TeacherUseCase } from "../../application/useCase/TeacherUseCase";
import { Request,Response } from "express";

export class TeacherController {

    constructor(private teacherUseCase: TeacherUseCase) {}
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
          

            const {teachers,totalPages} = await this.teacherUseCase.fetchTeachers(query,page,limit)
            res.status(200).json({ success: true,message:'Fetching of teacher is successfull', data: teachers, totalPages:totalPages });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
   

    async addTeacher(req: Request, res: Response) {
        try {
            const { name,phone,address, email, password, registerNumber,profile } = req.body;
            const newTeacher = await this.teacherUseCase.addTeacher(name,phone,address, email, password, registerNumber,profile)
            res.status(200).json({ success: true,message:'Adding of teacher is successfull', data: newTeacher });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
  
    async deleteTeacher(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            await this.teacherUseCase.deleteTeacher(id);
            res.status(200).json({ success: true,message:'Deleting of teacher is successfull' });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    
    async updateTeacher(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            const { name,phone,address, email, password, registerNumber,profile } = req.body;
            const updatedTeacher = await this.teacherUseCase.updateTeacher(id,name,phone,address, email, password, registerNumber,profile)
            res.status(200).json({ success: true,message:'Updating of teacher is successfull', data: updatedTeacher });
            
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

   
}