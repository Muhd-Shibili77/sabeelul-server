import { StudentUseCase } from "../../application/useCase/StudentUseCase";
import { Request,Response } from "express";
import { StatusCode } from "../../application/constants/statusCode";
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
                  { name: { $regex: search, $options: "i" },isDeleted: false },
                  { admissionNo: { $regex: search, $options: "i" },isDeleted: false }
                ]
              }
            : { isDeleted: false };


            const {students,totalPages} = await this.studentUsecase.fetchStudents(query,page,limit)
            res.status(StatusCode.OK).json({ success: true,message:'Fetching of student is successfull', students, totalPages:totalPages });
            
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async addStudent(req: Request, res: Response) {
        try {
            
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const newStudent = await this.studentUsecase.addStudent(admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(StatusCode.OK).json({ success: true,message:'Adding of student is successfull', students: newStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async deleteStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            await this.studentUsecase.deleteStudent(id);
            res.status(StatusCode.OK).json({ success: true,message:'Deleting of student is successfull' });
            
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async updateStudent(req: Request, res: Response) {
        try {
            const id: string = req.params.id;
            
            const { admissionNo,name,phone, email, password,className,address,guardianName,profile } = req.body;
            const updatedStudent = await this.studentUsecase.updateStudent(id,admissionNo,name,phone, email, password,className,address,guardianName,profile )
            res.status(StatusCode.OK).json({ success: true,message:'Updating of student is successfull', data: updatedStudent });
            
        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async findByAdmNo(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            const student = await this.studentUsecase.findByAdmissinNo(id)
            res.status(StatusCode.OK).json({ success: true,message:'fetching of student is successfull',student });

        } catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async addExtraScore(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            const {programName,mark} = req.body
            const student = await this.studentUsecase.addExtraScore(id,programName,mark)
            res.status(StatusCode.OK).json({ success: true,message:'add Extra mark to student is successfull', data: student });
   
        }catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async deleteStudentExtraScore(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            await this.studentUsecase.deleteExtraScore(id)
            res.status(StatusCode.OK).json({ success: true,message:'delete Extra mark to student is successfull' });
   
        }catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async editStudentExtraScore(req:Request,res:Response){
        try {
            const id: string = req.params.id;
            const {mark} = req.body 
            await this.studentUsecase.editExtraScore(id,mark)
            res.status(StatusCode.OK).json({ success: true,message:'edit Extra mark to student is successfull' });
   
        }catch (error: any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }

    async addMentorScore(req:Request,res:Response){
        try {
            const id:string  = req.params.id;
            const {mark} = req.body
            const student = await this.studentUsecase.addMentorScore(id,mark)
            res.status(StatusCode.OK).json({success:true,message:'add mentor mark to student is successful',data:student})
        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }
    async addCceScore(req:Request,res:Response){
        try {
            const id:string = req.params.id
            const {classId,subjectName,phase,mark}  = req.body
            
            const student = await this.studentUsecase.addCceScore(id,classId,subjectName,phase,mark)
            res.status(StatusCode.OK).json({success:true,message:'add CCE mark to student is successful',data:student})

        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }

    async fetchProfile(req:Request,res:Response){
        try {
            const id:string = req.params.id
            const student = await this.studentUsecase.fetchProfile(id)
            res.status(StatusCode.OK).json({success:true,message:'fetching profile successfull',student})
            
        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }

    async dashboard(req:Request,res:Response){
        try {
            const id:string = req.params.id
            const dashboard = await this.studentUsecase.dashboard(id)
            res.status(StatusCode.OK).json({success:true,message:'fetching dashboard successfull',dashboard})

            
        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }
    async performance(req:Request,res:Response){
        try {
            const id:string = req.params.id
            const performance = await this.studentUsecase.performance(id)
            res.status(StatusCode.OK).json({success:true,message:'fetching performance details successfull',performance})

            
        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }

    async fetchByClass(req:Request,res:Response){
       
        try { 
            const classId:string = req.params.id
            const students = await this.studentUsecase.fetchByClass(classId)
            res.status(StatusCode.OK).json({success:true,message:'fetching students successfull',students})
            
        } catch (error:any) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message }); 
        }
    }

}