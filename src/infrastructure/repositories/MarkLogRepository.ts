import { IMarkLogRepository } from "../../application/interface/IMarkLogRepository";
import MarkLogs from "../../domain/entites/MarkLog";
import MarkLogModel from "../models/MarkLogs";

export class MarkLogRepository implements IMarkLogRepository {
 async addMarkLog(
  userId: string,
  academicYear: string,
  item: string,
  score: number,
  scoreType: string
): Promise<MarkLogs> {
  const existingDoc = await MarkLogModel.findOne({ userId });

  const markEntry = {
    academicYear,
    item,
    score,
    date: new Date(),
    scoreType,
  };

  if (existingDoc) {
    // Find index of existing mark with same academicYear and item
    const index = existingDoc.marks.findIndex(
      (m: any) => m.academicYear === academicYear && m.item === item
    );

    if (index !== -1) {
      // Update existing entry
      existingDoc.marks[index] = markEntry;
    } else {
      // Push new entry
      existingDoc.marks.push(markEntry);
    }

    await existingDoc.save();
    return new MarkLogs(existingDoc.toObject() as MarkLogs);
  } else {
    // No document found — create a new one
    const newDoc = new MarkLogModel({
      userId,
      marks: [markEntry],
    });

    await newDoc.save();
    return new MarkLogs(newDoc.toObject() as MarkLogs);
  }
}


  async getMarkLogs(userId: string, academicYear: string): Promise<MarkLogs[]> {
    const markLogs = await MarkLogModel.find({ userId, "marks.academicYear": academicYear });
    return markLogs.map((log) => new MarkLogs(log.toObject() as MarkLogs));
  }
}