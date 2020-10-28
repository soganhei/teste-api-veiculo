import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes';
import { IVeiculo } from "../../schema";


import Services from '../../services'


const Find = (req: Request, res: Response)=>{

    const query = req.query;

    const items = Services.VeiculosServices.Find(query)
    
    res.status(StatusCodes.OK)
    res.send(items)

}

const FindByid = (req: Request, res: Response) =>{

    const idVeiculo= parseInt(req.params.id)

    const item  = Services.VeiculosServices.FindByid(idVeiculo)

    res.status(StatusCodes.OK)
    res.send(item)

}

const Create = (req: Request, res: Response)=>{

     
    const payload: IVeiculo = req.body

    const isPlaca = Services.VeiculosServices.IsPlaca(payload.placa)
    if(isPlaca){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message:`Placa ${payload.placa} já cadatrada!`
        })
        return 
    }

    const item = Services.VeiculosServices.Create(payload)

    res.status(StatusCodes.CREATED)
    res.send(item)
    
}

const Update = (req: Request, res: Response) =>{

    const idVeiculo= parseInt(req.params.id)
    
    let payload: IVeiculo = req.body
     
    const item = Services.VeiculosServices.Update(payload, idVeiculo)

    res.status(StatusCodes.OK)
    res.send(item)

}

const Delete = (req: Request, res: Response) =>{

    const idVeiculo= parseInt(req.params.id)

    const isSaidas = Services.SaidasServices.IsItem("idVeiculo",idVeiculo)
    if(isSaidas){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar veiculo ${idVeiculo}. Contem saídas vinculadas!`
        }) 
        return
    }

    const ok  = Services.VeiculosServices.Delete(idVeiculo)

    if(!ok){

        res.status(StatusCodes.BAD_REQUEST)
        res.send({
            message: `Erro para deletar Veiculo ${idVeiculo}`
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