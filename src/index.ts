import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/config/DB";
import AuthRoute from "./Interface/routes/AuthRoute";
import TeacherRoute from "./Interface/routes/TeacherRoute";
import ClassRoute from "./Interface/routes/ClassRoute";
import ProgramRoute from './Interface/routes/ProgramRoute';
import StudentRoute from './Interface/routes/StudentRoute';
import AdminRoute from './Interface/routes/AdminRoute'
import HomeRoute from './Interface/routes/HomeRoute'
dotenv.config();
const app = express();
const URL = process.env.URL as string;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [URL, 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB()

app.use("/auth", AuthRoute);
app.use("/teacher", TeacherRoute);
app.use("/class", ClassRoute);
app.use("/program", ProgramRoute);
app.use("/student", StudentRoute);
app.use("/admin", AdminRoute);
app.use("/home",HomeRoute)
app.get("/", (req, res) => {
  res.send("server is working");
});



app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})
