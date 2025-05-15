class Class{
    public readonly id!:string;
    public name!:string
    public icon!:string
    public subjects!:string[];
    public isDeleted!:boolean;
    public marks!:{
        academicYear:string,
        item:string,
        score:number
    }[];

    constructor(data:Partial<Class>){
        Object.assign(this,data)
    }
}
export default Class