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
import PKVRoute from './Interface/routes/PKVRoute'
import SemesterRoute from './Interface/routes/SemesterRoute'
import path from "path";
import cleanAllStudentsCCE from "./shared/utils/clearRepeatCCe";
import { addAdmin } from "./shared/utils/addAdmin";
import ThemeModel from "./infrastructure/models/ThemeModel";
import { addSemester } from "./shared/utils/addSemester";

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
app.use("/pkv",PKVRoute)
app.use("/semester",SemesterRoute)
app.get("/", (req, res) => {
  res.send("server is working");
});
app.get("/clean", (req, res) => {
  res.send("Cleaning....");
  // cleanAllStudentsCCE()
});
app.get("/addAdmin", (req, res) => {
  // addAdmin('admin@shibili.com','123456')
  res.send("Adding... admin");
});
app.get("/addSemester", (req, res) => {
  // addSemester('Rabee Semester')
  // addSemester('Ramadan Semester')
  res.send("Adding... semester");
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

// import XLSX from 'xlsx';
// import classModel from "./infrastructure/models/ClassModel";

// async function convertExcelToSubjects() {
//   const workbook = XLSX.readFile("./Subject list.xlsx");
//   const sheetName = workbook.SheetNames[9];
//   const subjectData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//   console.log(subjectData); // Optional: Debug the data

//   for (const row of subjectData) {
//     const subjectList = (row["Subjects"] || "")
//       .split(",")
//       .map((sub: string) => sub.trim())
//       .filter((sub: string) => sub.length > 0);

//       console.log(subjectList)
//     if (subjectList.length === 0) {
//       console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
//       continue;
//     }

//     // Find class and update subjects
//     const existingClass = await classModel.findById("6847a0ef013f4c9143ef571c");
//     if (!existingClass) {
//       console.error(`❌ Class not found: 6847a0ef013f4c9143ef571c`);
//       continue;
//     }

//     existingClass.subjects.push(subjectList[0]);
//     await existingClass.save();
//     console.log(`✅ Subjects updated for class: ${existingClass.name}`);
//   }

//   console.log("🎉 Subject import completed.");
//   process.exit();
// }

app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})
