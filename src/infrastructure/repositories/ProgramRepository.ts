import { IProgramRepository } from "../../application/interface/IProgramRepository";
import Program from "../../domain/entites/Program";
import ProgramModel from "../models/ProgramModel";

export class ProgramRespository implements IProgramRepository{
    async addProgram(program: Program): Promise<Program> {
        const newProgram = new ProgramModel(program);
        await newProgram.save();
        return new Program(newProgram.toObject() as Program);
      }
    
      async editProgram(id: string, program: Program): Promise<Program> {
        const updatedProgram = await ProgramModel.findByIdAndUpdate(id, program, {
          new: true,
        });
        if (!updatedProgram) {
          throw new Error("Program not found");
        }
        return new Program(updatedProgram.toObject() as Program);
      }
      async deleteProgram(id: string): Promise<void> {
        const program = await ProgramModel.findByIdAndUpdate(id, { isDeleted: true });
        if (!program) {
          throw new Error("Program not found");
        }
      }
    
      async findProgramById(id: string): Promise<Program | null> {
        const program = await ProgramModel.findById(id);
        if (!program) {
          return null;
        }
        return new Program(program.toObject() as Program);
      }
        async fetchPrograms(
            query: object,
            page?: number,
            limit?: number
        ): Promise<{ programs: Program[]; totalPages?: number }> {
            if (page && limit) {
            const count = await ProgramModel.countDocuments(query);
            const totalPages = Math.ceil(count / limit);
            const programs = await ProgramModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ name: 1 });
        
            return {
                programs: programs.map(
                (programData) => new Program(programData.toObject() as Program)
                ),
                totalPages,
            };
            } else {
            const programs = await ProgramModel.find(query).sort({ name: 1 });
            return {
                programs: programs.map(
                (programData) => new Program(programData.toObject() as Program)
                ),
            };
            }
        }
}
