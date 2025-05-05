import AdminModel from "../../infrastructure/models/AdminModel";
import bcrypt from 'bcrypt'

export const addAdmin = async (email:string,password:string)=>{
    const hashedPassword = await bcrypt.hash(password, 10);
    await AdminModel.create({
        email:email,
        password:hashedPassword
    })
}