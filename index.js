import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express()

app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})