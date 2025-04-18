import Admin from "../../domain/entites/Admin";
import Teacher from "../../domain/entites/Teacher";
import Student from "../../domain/entites/Student";

export interface IAuthRepository {
    findByEmail(email: string): Promise<Admin | null>;
    findTeacher(login: string): Promise<Teacher | null>;
    findStudent(login: string): Promise<Student | null>;
}
