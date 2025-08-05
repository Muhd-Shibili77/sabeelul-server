import connectDB from "../../infrastructure/config/DB";
import StudentModel from "../../infrastructure/models/StudentModel";

export default async function cleanAllStudentsCCE() {
  connectDB();
  const students = await StudentModel.find({});
  for (const student of students) {
    if (!student.cceMarks) continue;
    const mergedCCE:any = {};

    student.cceMarks.forEach((entry) => {
      const key = `${entry.academicYear}-${entry.semester}-${entry.className}`;

      if (!mergedCCE[key]) {
        mergedCCE[key] = {
          academicYear: entry.academicYear,
          semester: entry.semester,
          className: entry.className,
          subjects: [...entry.subjects], // Clone subjects
        };
      } else {
        const existingSubjects = mergedCCE[key].subjects;
        entry.subjects.forEach((sub) => {
          const isDuplicate = existingSubjects.some(
            (s:any) =>
              s.subjectName === sub.subjectName &&
              s.phase === sub.phase &&
              s.mark === sub.mark
          );

          if (!isDuplicate) {
            existingSubjects.push(sub);
          }
        });
      }
    });

    student.cceMarks = Object.values(mergedCCE);
    try {
      await student.save();
      console.log(`✅ Cleaned student: ${student.name || student._id}`);
    } catch (err:any) {
      console.error(`❌ Failed for ${student._id}:`, err.message);
    }
  }
  console.log("🎉 All student cceMarks cleaned.");
}
