class PKV {
  public readonly id!: string;
  public readonly studentId!: string;
  public PKVmarks!: {
    academicYear: string;
    semester: string;
    marks: {
      phase: string;
      mark: number;
      date: Date;
    }[];
  }[];

  constructor(data: Partial<PKV>) {
   Object.assign(this, data);
  }
}
export default PKV;