class Student{
    public readonly id!:string;
    public admissionNo!:string
    public name!:string
    public phone!:number
    public address!:string
    public email!:string
    public password!:string
    public classId!:string
    public guardianName!:string
    public profileImage!:string
    public isDeleted!:boolean
    public extraMarks?:{
        academicYear:string,
        programId:string,
        customProgramName:string,
        mark:number,
        date:Date,
        discription:string,
    }[]
    public mentorMarks?:{
        academicYear:string,
        mark:number,
        date:Date
    }[]
    public cceMarks?:{
        academicYear: string;
        className:string,
        subjects:{
            subjectName:string,
            phase:string,
            mark:number,
            date:Date
        }[]
    }[]

    constructor(data:Partial<Student>){
        Object.assign(this,data)
    }
}
export default Student