class Program{
    public readonly id!:string;
    public name!:string
    public startDate!:Date
    public endDate!:Date
    public criteria!:string
    public classes!:string[]; 
    public isDeleted!:boolean

    constructor(data:Partial<Program>){
        Object.assign(this,data)
    }
}
export default Program