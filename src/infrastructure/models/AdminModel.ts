import mongoose,{Schema,Document} from "mongoose";

export interface IAdmin extends Document{
    email:string,
    password:string
}

const adminSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{ timestamps:true})

const AdminModel = mongoose.model<IAdmin>('Admin',adminSchema)

export default AdminModel