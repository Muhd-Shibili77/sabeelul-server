class Teacher{
    public readonly id!:string;
    public name!:string
    public phone!:number
    public address!:string
    public password!:string
    public registerNo!:string
    public email!:string
    public profileImage!:string

    constructor(data:Partial<Teacher>){
        Object.assign(this,data)
    }
}
export default Teacher