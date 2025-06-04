class MarkLogs {
  public readonly id!: string;
  public readonly userId!: string;
  public marks!: {
    markId: string;
    academicYear: string;
    title: string;
    score: number;
    date: Date;
    scoreType: String;
    
  }[];

  constructor(data: Partial<MarkLogs>) {
   Object.assign(this, data);
  }
}
export default MarkLogs;