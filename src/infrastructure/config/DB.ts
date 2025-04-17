import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async ():Promise<void> => { 
  try { 
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables.");
      }
      
     await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.error('mongodb connection error:',error);
   
  }
};

export default connectDB