class Semester {
    public readonly id!:string;
    public name!:string;
    public isLocked!:boolean;

    constructor(data:Partial<Semester>){
        Object.assign(this,data)
    }
}

export default Semester;
