import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes';


import Services from '../../services'


const Find = (req: Request, res: Response)=>{

    const items = Services.LogsServices.Find()
    
    res.status(StatusCodes.OK)
    res.send(items)

}

export default {
    Find, 
}