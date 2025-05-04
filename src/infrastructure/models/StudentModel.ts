import mongoose,{Schema,Document, Model} from "mongoose";



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
    isDeleted?:boolean
    extraMarks?: {
        academicYear: string;
        programId?: mongoose.Types.ObjectId;
        customProgramName?: string;
        mark: number;
        date:Date
    }[],
    mentorMarks?:{
        academicYear:string;
        mark:number
    }[],
    cceMarks?:{
        academicYear: string;
        className:string,
        subjects:{
            subjectName:string,
            phase:string,
            mark:number
        }[]  
    }[]
}

const studentSchema = new Schema({
    admissionNo:{
        type:String,
        required:true,
        unique: true
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
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    extraMarks:[{
        academicYear: {
            type: String,
        },
        programId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Program',
            default: null
        },
        customProgramName:{
            type:String,
            default: null
        },
        mark: {
            type: Number,
            required: true
        },
        date:{
            type:Date,
            default:new Date()
        }
    }],
   mentorMarks:[{
        academicYear:{
            type:String,
        },
        mark:{
            type:Number,
        }  
   }],
   cceMarks:[{
        academicYear: {
            type: String,
        },
        className: {
            type: String,
            default: null
        },
        subjects: [{
            subjectName: {
                type: String,

            },
            phase: {
                type: String,

            },
            mark: {
                type: Number,

            }
        }]
   }] 
    
},{ timestamps:true})

const StudentModel: Model<IStudent> = mongoose.model<IStudent>('Student',studentSchema)

export default StudentModel