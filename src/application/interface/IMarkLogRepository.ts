import { get } from "http";
import MarkLogs from "../../domain/entites/MarkLog";

export interface IMarkLogRepository {
  addMarkLog(userId: string,academicYear: string,item: string,score: number,scoreType: string,markId: string): Promise<MarkLogs | null>
  updateMarkLog(userId: string,markId: string,updatedScore: number,updatedTitle?: string): Promise<void> 
  deleteMarkLog(userId:string,markId: string): Promise<void> 
  getMarkLogs(userId: string,academicYear: string): Promise<MarkLogs[]>;
} 