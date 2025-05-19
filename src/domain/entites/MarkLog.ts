class MarkLogs {
  public readonly id!: string;
  public readonly userId!: string;
  public marks!: {
    academicYear: string;
    item: string;
    score: number;
    date: Date;
    scoreType: String;
  }[];

  constructor(data: Partial<MarkLogs>) {
   Object.assign(this, data);
  }
}
export default MarkLogs;