import mongoose,{Schema,Document} from "mongoose";

export interface IAdmin extends Document{
    email:string,
    password:string,
    isBlock:boolean
}

const adminSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isBlock:{
        type:Boolean,
        default:false
    }
},{ timestamps:true})

const AdminModel = mongoose.model<IAdmin>('Admin',adminSchema)

export default AdminModel