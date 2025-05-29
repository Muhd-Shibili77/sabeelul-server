import { IProgramRepository } from "../interface/IProgramRepository";
import { IStudentRepository } from "../interface/IStudentRepository";

export class HomeUseCase{
    constructor(
        private studentRepository :IStudentRepository,
        private programRepository :IProgramRepository
    ){}

    async fetchDetails (){
        
        const classAnalysis = await this.studentRepository.getBestPerformingClass();
        const bestPerformerClass = classAnalysis[0]; 
        const performerAnalysis = await this.studentRepository.bestPerformerOverall()
        const starPerformer = performerAnalysis[0]
        const upcomingProgram = await this.programRepository.upcomingProgram()
        return {bestPerformerClass,starPerformer,performerAnalysis,upcomingProgram}
    }

    async fetchLeaderBoard(classId:string){
        if(!classId){
            throw new Error('class id not found')
        }
        const classLeaderBoard = await this.studentRepository.getTopStudentsInClass(classId)

        return classLeaderBoard
    }
    async fetchClassLeaderBoard(){
        const classLeaderBoard = await this.studentRepository.getTopClass()
        return classLeaderBoard
    }
}