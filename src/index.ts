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
import path from "path";


import ThemeModel from "./infrastructure/models/ThemeModel";

dotenv.config();
const app = express();
const URL = process.env.API_URL as string;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// async function addTheme(){
//   const levels = [
//   { label: "Green", minMark: 600, maxMark: 1000 },
//   { label: "Blue", minMark: 500, maxMark: 599 },
//   { label: "Purple", minMark: 400, maxMark: 499 },
//   { label: "Orange", minMark: 300, maxMark: 399 },
//   { label: "Red", minMark: 200, maxMark: 299 },
//   { label: "Below Level", minMark: 0, maxMark: 199 },
// ];

// await ThemeModel.insertMany(levels)
// }

app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})
