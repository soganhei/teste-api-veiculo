import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes';
import { IMotorista } from "../../estrutura";


import Services from '../../services'


const Find = (req: Request, res: Response)=>{

    const items = Services.LogsServices.Find()
    
    res.status(StatusCodes.OK)
    res.send(items)

}