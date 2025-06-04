import { IMarkLogRepository } from "../../application/interface/IMarkLogRepository";
import MarkLogs from "../../domain/entites/MarkLog";
import MarkLogModel from "../models/MarkLogs";

export class MarkLogRepository implements IMarkLogRepository {
  async getMarkLogs(userId: string, academicYear: string): Promise<MarkLogs[]> {
    const markLogs = await MarkLogModel.aggregate([
      {
        $match: {
          userId,
          "marks.academicYear": academicYear,
        },
      },
      { $unwind: "$marks" },
      {
        $match: {
          "marks.academicYear": academicYear,
        },
      },
      {
        $sort: {
          "marks.date": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          marks: { $push: "$marks" },
        },
      },
    ]);

    // Return result typed as MarkLogs[]
    return markLogs as MarkLogs[];
  }

  async addMarkLog(
    userId: string,
    academicYear: string,
    item: string,
    score: number,
    scoreType: string,
    markId: string
  ): Promise<MarkLogs | null> {
    const existingDoc = await MarkLogModel.findOne({ userId });

    const markEntry = {
      markId,
      academicYear,
      title: item,
      score,
      date: new Date(),
      scoreType,
    };

    if (existingDoc) {
      const alreadyLogged = existingDoc.marks.some(
        (m: any) => m.markId === markId
      );
      if (alreadyLogged)
        return new MarkLogs(existingDoc.toObject() as MarkLogs);

      existingDoc.marks.push(markEntry);
      await existingDoc.save();
      return new MarkLogs(existingDoc.toObject() as MarkLogs);
    } else {
      const newDoc = new MarkLogModel({
        userId,
        marks: [markEntry],
      });
      await newDoc.save();
      return new MarkLogs(newDoc.toObject() as MarkLogs);
    }
  }

  async updateMarkLog(
    userId: string,
    markId: string,
    updatedScore: number,
    updatedTitle?: string
  ): Promise<void> {
    const existingDoc = await MarkLogModel.findOne({ userId });
    if (!existingDoc) return;

    const index = existingDoc.marks.findIndex((m: any) => m.markId === markId);
    if (index === -1) return;

    existingDoc.marks[index].score = updatedScore;
    if (updatedTitle) {
      existingDoc.marks[index].title = updatedTitle;
    }
    existingDoc.marks[index].date = new Date(); // Optional: update timestamp

    await existingDoc.save();
  }

  async deleteMarkLog(userId:string,markId: string): Promise<void> {
   await MarkLogModel.updateOne({ userId }, { $pull: { marks: { markId } } });
  }
}
