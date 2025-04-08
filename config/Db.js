
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.MONGO_URI){
  console.log('mongo url env not found')
}

const connectDB = async () => { 
  try { 
    
     await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.error('mongodb connection error:',error);
   
  }
};

export default connectDB