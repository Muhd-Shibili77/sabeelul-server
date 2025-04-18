import mongoose,{Schema,Document} from "mongoose";

export interface IStudent extends Document{
    admissionNo:string,
    name:string,
    phone:number,
    address:string,
    email:string,
    password:string,
    classId:string,
    guardianName:string,
    profileImage:string,
}

const studentSchema = new Schema({
    admissionNo:{
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
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Class',
        required:true
    },
    guardianName:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    }
},{ timestamps:true})

const StudentModel = mongoose.model<IStudent>('Teacher',studentSchema)

export default StudentModel