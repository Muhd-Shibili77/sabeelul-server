import Admin from "../../domain/entites/Admin";

export interface IAuthRepository {
    findByEmail(email: string): Promise<Admin | null>;
}
