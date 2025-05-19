import { get } from "http";
import MarkLogs from "../../domain/entites/MarkLog";

export interface IMarkLogRepository {
  addMarkLog(userId:string,academicYear:string,item:string,score:number,scoreType:string): Promise<MarkLogs>;
  getMarkLogs(userId: string,academicYear: string): Promise<MarkLogs[]>;
} 