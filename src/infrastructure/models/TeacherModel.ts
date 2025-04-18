import mongoose,{Schema,Document} from "mongoose";

export interface ITeacher extends Document{
    registerNo:string,
    name:string,
    phone:number,
    address:string,
    email:string,
    password:string,
    profileImage:string,
}

const teacherSchema = new Schema({
    registerNo:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    }
},{ timestamps:true})

const TeacherModel = mongoose.model<ITeacher>('Teacher',teacherSchema)

export default TeacherModel