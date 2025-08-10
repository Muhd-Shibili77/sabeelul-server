class Class {
  public readonly id!: string;
  public name!: string;
  public icon!: string;
  public subjects!: string[];
  public isDeleted!: boolean;
  public marks!: {
    academicYear: string;
    item: string;
    score: number;
    description: string;
    date: Date;
  }[];
  public penaltyMarks?: {
    academicYear: string;
    reason: string;
    penaltyScore: number;
    description: string;
    date: Date;
  }[];
  public semesterAverages?: {
    academicYear: string;
    semester: string;
    avgCCeMark: number;
    avgMentorMark: number;
    avgPKVMark: number;
    dateCalculated: Date;
  }[];

  constructor(data: Partial<Class>) {
    Object.assign(this, data);
  }
}
export default Class;
