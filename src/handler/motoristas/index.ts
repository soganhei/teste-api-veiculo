import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes';
import { IMotorista } from "../../estrutura";


import Services from '../../services'


const Find = (req: Request, res: Response)=>{

    const query = req.query;

    const items = Services.MotoristasServices.Find(query)
    
    res.status(StatusCodes.OK)
    res.send(items)

}

const FindByid = (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)

    const item  = Services.MotoristasServices.FindByid(idMotorista)

    res.status(StatusCodes.OK)
    res.send(item)

}

const Create = (req: Request, res: Response)=>{
     
    const payload: IMotorista = req.body

    const isNome = Services.MotoristasServices.IsNome(payload.nome)
    if(isNome){

        res.status(StatusCodes.BAD_REQUEST)

        const message = `Motorista ${payload.nome} já cadastrado!`
        
         
        res.send({ message }) 
        return
    }

    const item = Services.MotoristasServices.Create(payload)
 
    res.status(StatusCodes.CREATED)
    res.send(item)
    
}

const Update = (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)
    
    let payload: IMotorista = req.body
     
    const motorista = Services.MotoristasServices.Update(payload, idMotorista)

    res.status(StatusCodes.OK)
    res.send(motorista)

}

const Delete = (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)

    const isSaisas = Services.SaidasServices.IsItem("idMotorista",idMotorista)
    if(isSaisas){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar motorista ${idMotorista}. Contem saídas vinculadas!`
        }) 
        return
    }
 
    const ok  = Services.MotoristasServices.Delete(idMotorista)

    if(!ok){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar motorista ${idMotorista}`
        }) 
        return    
    }

    res.status(StatusCodes.NO_CONTENT)
    res.send({})

}

export default {
    Find, 
    Update, 
    Create, 
    Delete, 
    FindByid, 

}