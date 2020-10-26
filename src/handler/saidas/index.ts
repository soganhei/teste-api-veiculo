import {Request,Response} from 'express';

import {StatusCodes} from 'http-status-codes';
import {IFormSaidaVeiculo} from '../../estrutura'


import Services from '../../services/index';

import {FormatDate} from '../../lib';


const Find = (req:Request,res:Response)=>{

    const items = Services.SaidasServices.Find()
    res.status(StatusCodes.OK)
    res.send(items)

}

const FindByid = (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)

    const item  = Services.SaidasServices.FindByid(idMotorista)

    res.status(StatusCodes.OK)
    res.send(item)

}

const Create = (req: Request, res: Response)=>{
     
    const payload: IFormSaidaVeiculo = req.body

    const date = FormatDate(new Date())

    const isMotorista = Services.MotoristasServices.FindByid(payload.idMotorista)
    const isVeiculo = Services.VeiculosServices.FindByid(payload.idVeiculo)

    const idMotorista = Services.SaidasServices.IsItem("idMotorista",payload.idMotorista)
    const idVeiculo = Services.SaidasServices.IsItem("idVeiculo",payload.idVeiculo)
    const dataSaida = Services.SaidasServices.IsItem("dataSaida",date)

    if(!isMotorista && !isVeiculo){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Veículo ${payload.idVeiculo} e motorista ${payload.idMotorista} não encontrado`
        }) 
        return
    }

    if(idMotorista && idVeiculo && dataSaida){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: 'Entrada já realizada'
        }) 
        return 
    }

    const item = Services.SaidasServices.Create(payload)

    res.status(StatusCodes.CREATED)
    res.send(item)
    
}

const Update = (req: Request, res: Response) =>{

    const idMotorista= parseInt(req.params.id)
    
    const payload: IFormSaidaVeiculo = req.body
     
    const motorista = Services.SaidasServices.Update(payload, idMotorista)

    res.status(StatusCodes.OK)
    res.send(motorista)

}

const Delete = (req: Request, res: Response) =>{

    const idSaida = parseInt(req.params.id)
   
    const ok  = Services.SaidasServices.Delete(idSaida)

    if(!ok){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar saída ${idSaida}`
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