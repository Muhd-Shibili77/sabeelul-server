import Program from "../../domain/entites/Program";

export interface IProgramRepository{
    addProgram(program: Program): Promise<Program>;
    editProgram(id: string, program: Program): Promise<Program>;
    deleteProgram(id: string): Promise<void>;
    findProgramById(id: string): Promise<Program | null>;
    fetchPrograms(query: object, page?: number, limit?: number): Promise<{ programs: Program[]; totalPages?: number }>;
    upcomingProgram():Promise<Program[]>
}