import express, {Request,Response} from 'express';
import {StatusCodes} from 'http-status-codes';
 
import {FormatDate} from '../../lib';

import { IMotoristasServices,IVeiculosServices,  ISaidasForm, ISaidasServices } from '../../schemas'

export interface IHandler {
    MotoristasServices:IMotoristasServices,
    VeiculosServices:IVeiculosServices, 
    SaidasServices:ISaidasServices
}

let handler: IHandler

const NewHandler = (h:IHandler) => {

    handler = h

    const router = express()
    router
        .post('/saidas',Create)
        .get('/saidas',Find)
        .get('/saidas/:id',FindByid)
        .put('/saidas/:id',Update)
        .delete('/saidas/:id',Delete)
    return router
}


const Find = async (req:Request,res:Response)=>{

    try {

        const response = await handler.SaidasServices.Find()
        res.status(StatusCodes.OK)
        res.send(response)
        
    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST)
        res.send({ message: error.message }) 
    } 
    

}

const FindByid = async (req: Request, res: Response) =>{

    const idMotorista = parseInt(req.params.id)

    try {
        
        const response  = await handler.SaidasServices.FindByid(idMotorista)
        res.status(StatusCodes.OK)
        res.send(response)

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST)
        res.send({ message: error.message }) 
    } 

}

const Create = async (req: Request, res: Response)=>{
     
    const payload: ISaidasForm = req.body

    const date = FormatDate(new Date())
     
    try {

        const response = await handler.SaidasServices.Create(payload)

        res.status(StatusCodes.CREATED)
        res.send(response)
        
    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST)
        res.send({ message: error.message })        
    } 
    
}

const Update = async (req: Request, res: Response) =>{

    const idMotorista = parseInt(req.params.id)
    
    const payload: ISaidasForm = req.body

    try {

        const response = await handler.SaidasServices.Update(payload, idMotorista)
        res.status(StatusCodes.OK)
        res.send(payload)
        
    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST)
        res.send({ message: error.message })   
    } 

}

const Delete = async (req: Request, res: Response) =>{

    const idSaida = parseInt(req.params.id)

    try {

        await handler.SaidasServices.Delete(idSaida)
        res.status(StatusCodes.NO_CONTENT)
        res.send(null)

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST)
        res.send({ message: error.message })   
    } 

}

export default  { NewHandler }