
import db from '../db'

import { IMotoristas, IVeiculos, ISaidas, ISaidasForm, ISaidasServices } from '../../schemas'
import { FormatDate, FormatDatePtBr } from '../../lib'

import errors from './errors'

import MotoristasServices from '../motoristas'
import VeiculosServices from '../veiculos'
 
const KEY = 'saidas'

const Find = async (): Promise<ISaidas[]> => {

    const saidas: ISaidasForm[] = await db.Find(KEY)
    
    let items: ISaidas[] = []

    for(const item of saidas){

        const {
            idMotorista,
            idVeiculo,
            dataSaida,
            dataEntrada
        } = item

        const motorista = await db.Findbyid(idMotorista)
        const veiculo   = await db.Findbyid(idVeiculo)

        const data = {
            ...item,
            veiculo,
            motorista,
            dataSaida: FormatDatePtBr(dataSaida),
            dataEntrada: FormatDatePtBr(dataEntrada)
        }
        items.push(data)
    }  
    return items
}

const FindByid = async (id:number): Promise<ISaidas> => {

    const item: ISaidas = await db.Findbyid(id)

    const motorista: IMotoristas = await db.Findbyid(item.idMotorista)
    const veiculo : IVeiculos = await db.Findbyid(item.idVeiculo)

    return { ...item, motorista, veiculo }
}

const Create = async (payload:ISaidasForm): Promise<ISaidasForm> => {

    const isMotorista = await MotoristasServices.FindByid(payload.idMotorista)
    const isVeiculo   = await VeiculosServices.FindByid(payload.idVeiculo)

    if(!isMotorista && !isVeiculo){
        throw errors.ErrorVMNaoCadastrado
    }

    const date = FormatDate(new Date())

    const idMotorista = await ForenKey('idMotorista',payload.idMotorista)
    const idVeiculo   = await ForenKey('idVeiculo',payload.idVeiculo)
    const dataSaida   = await ForenKey('dataSaida',date)

    if(idMotorista && idVeiculo && dataSaida){
        throw errors.ErrorSaidaCadastrada
    }

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao = new Date()
    payload.dataSaida = FormatDate(new Date())
  
    payload.key = KEY
 
    const response = await db.Create(payload)
    if(response instanceof Error) {
        throw errors.ErrorCadastrarSaida
        
    }
    return payload
}

const Update = async (payload:ISaidasForm, id:number): Promise<ISaidasForm> =>{

    const item: ISaidasForm = await db.Findbyid(id)
        
    payload = { ...item, dataEntrada: payload.dataEntrada }
    
    const response = await db.Update(id, payload)     
    if(response instanceof Error){
        throw errors.ErrorCadastrarSaida
    }
    return payload

}
 
const Delete = async (idMotorista:number): Promise<void> => {
    
    const response =  await db.Delete(idMotorista)
     if(response instanceof Error){
        throw errors.ErrorDeletarSaida
    }
      
}

const ForenKey = async (key: keyof ISaidasForm, value: any): Promise<boolean> => {

    const saidas: ISaidasForm[] = await db.Find(KEY)

    const items = saidas.filter((item) => { return item[key] === value })

    if(items.length > 0) return true
    
    return false
}


const services : ISaidasServices = {
    Find, 
    Update, 
    Create, 
    Delete, 
    FindByid, 
    ForenKey, 
}

export default services
