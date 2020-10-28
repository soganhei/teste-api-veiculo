

import express, { Request, Response } from 'express'
import {StatusCodes} from 'http-status-codes';
 

import {ILogsServices} from '../../schema'

export interface IHandler {     
    LogsServices:ILogsServices,
}

let handler: IHandler

const NewHandler = (h:IHandler)=>{

    handler = h

    const router  = express()
    router
    .get("/logs",Find)

    return router      
}


const Find = (req: Request, res: Response)=>{

    const items = handler.LogsServices.Find()
    
    res.status(StatusCodes.OK)
    res.send(items)

}

export default {    
    NewHandler, 
}