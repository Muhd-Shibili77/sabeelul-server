import { Request,Response } from "express";
import { AdminUseCase } from "../../application/useCase/AdminUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class AdminController {
    constructor(private adminUseCase : AdminUseCase){}
    
}