import express,{Request,Response} from 'express';
import {StatusCodes} from 'http-status-codes';


import {IMotoristasServices,IMotoristas,ISaidasServices} from '../../schema'
 

export interface IHandler {     
    MotoristasServices:IMotoristasServices,
    SaidasServices:ISaidasServices, 
}

let handler: IHandler

const NewHandler = (h:IHandler)=>{

    handler = h

    const router  = express()
    router
        .post("/motoristas",Create)
        .get("/motoristas",Find)
        .get("/motoristas/:id",FindByid)
        .put("/motoristas/:id",Update)
        .delete("/motoristas/:id",Delete)
    return router      
}


const Find = async (req: Request, res: Response)=>{

    const query = req.query;

    const items = handler.MotoristasServices.Find(query)
         
    res.status(StatusCodes.OK)
    res.send(items)

}

const FindByid = async (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)

    const item  = handler.MotoristasServices.FindByid(idMotorista)

    res.status(StatusCodes.OK)  
    res.send(item)

}

const Create = async (req: Request, res: Response)=>{
     
    const payload: IMotoristas = req.body
    
    const isNome = handler.MotoristasServices.IsNome(payload.nome)
    if(isNome){

        res.status(StatusCodes.BAD_REQUEST)

        const message = `Motorista ${payload.nome} já cadastrado!`
        res.send({ message }) 
        return
    }

    const response = handler.MotoristasServices.Create(payload)
    if(response instanceof Error){    

        res.status(StatusCodes.BAD_REQUEST)

        const message = `Error para cadastrar motorista ${payload.nome}`
        res.send({ message }) 
        return
    }   
     
    res.status(StatusCodes.CREATED)    
    res.send(response)  
    
}

const Update = async (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)
    
    let payload: IMotoristas = req.body
     
    const motorista = handler.MotoristasServices.Update(payload, idMotorista)

    res.status(StatusCodes.OK)   
    res.send(motorista)

}

const Delete = async (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)

    const isSaisas = handler.SaidasServices.ForenKey("idMotorista",idMotorista)
    if(isSaisas){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar motorista ${idMotorista}. Contem saídas vinculadas!`
        }) 
        return
    }
 
    const response = handler.MotoristasServices.Delete(idMotorista)

    if(response instanceof Error){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar motorista ${idMotorista}`
        }) 
        return    
    }

    res.status(StatusCodes.NO_CONTENT)
    res.send({})

}

export default {NewHandler}