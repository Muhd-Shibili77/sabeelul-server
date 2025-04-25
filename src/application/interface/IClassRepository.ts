import Class from "../../domain/entites/Class";

export interface IClassRepository {
    addClass(classData: Class): Promise<Class>;
    editClass(id: string, classData: Class): Promise<Class>;
    deleteClass(id: string): Promise<void>;
    findClassById(id:string):Promise<Class | null> ;
    fetchClasses(query:object,page?:number,limit?:number): Promise<{classes: Class[], totalPages?: number}>;
    addScore(id:string,academicYear:string,item:string,score:number):Promise<Class>;
    editScore(id:string,academicYear:string,item:string,score:number):Promise<Class>;
    deleteScore(id:string,academicYear:string,item:string):Promise<Class>;
}