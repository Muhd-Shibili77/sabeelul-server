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

    constructor(data:Partial<Student>){
        Object.assign(this,data)
    }
}
export default Student