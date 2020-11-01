import db, { database } from '../db'

import {
  IMotoristas,
  IVeiculos,
  ISaidas,
  ISaidasForm,
  ISaidasServices,
} from '../../schemas'
import { FormatDate, FormatDatePtBr } from '../../lib'

import errors from './errors'
 
export const KEY = 'saidas'

const Find = async (): Promise<ISaidas[]> => {

  const saidas: ISaidasForm[] = await db.Find(KEY)
  const promises = saidas.map(async (item)=>{

    const { idMotorista, idVeiculo, dataSaida, dataEntrada } = item
    const {motorista, veiculo} = await listarMotoristaVeiculo(idMotorista, idVeiculo)

      return {
        ...item, 
        veiculo,
        motorista,
        dataSaida: FormatDatePtBr(dataSaida),
        dataEntrada: FormatDatePtBr(dataEntrada),
      }
  })

  const items = await Promise.all(promises)
  return items
}

const FindByid = async (id: number): Promise<ISaidas> => {
  const item: ISaidas = await db.Findbyid(id)

  const {motorista, veiculo} = await listarMotoristaVeiculo(item.idMotorista, item.idVeiculo)
  return { ...item, motorista, veiculo }

}

const Create = async (payload: ISaidasForm): Promise<ISaidasForm> => {

  const validarVMNaoCadastrado = async (idMotorista:number, idVeiculo:number): Promise<boolean> =>{

    const motorista = db.Findbyid(idMotorista)
    const veiculo   = db.Findbyid(idVeiculo)
    
    try {

      Promise.all([motorista, veiculo])
      return false
      
    } catch (error) {        
        return true
    }

  }

  const isMV = await validarVMNaoCadastrado(payload.idMotorista, payload.idVeiculo)
  if (isMV) {
    throw errors.ErrorVMNaoCadastrado
  }

  const validarSaidaCadastrada = async (idMotorista:number, idVeiculo: number): Promise<boolean> =>{

    const dataSaida = FormatDate(new Date())
    
    const motorista = ForenKey('idMotorista', idMotorista)
    const veiculo   = ForenKey('idVeiculo', idVeiculo)
    const data      = ForenKey('dataSaida', dataSaida)

     try {

        Promise.all([motorista, veiculo, data])
        return false
       
     } catch (error) {
        return true
     }

  }

  const isSaida = await validarSaidaCadastrada(payload.idMotorista, payload.idVeiculo)

  if (isSaida) {
      throw errors.ErrorSaidaCadastrada
  }

  const id = Math.floor(new Date().getTime() / 1000)

  payload.id = id
  payload.dataCriacao = new Date()
  payload.dataSaida = FormatDate(new Date())

  payload.key = KEY

  try {
    await db.Create(payload)
    return payload
    
  } catch (error) {
    throw errors.ErrorCadastrarSaida    
  }
   
}

const Update = async (
  payload: ISaidasForm,
  id: number
): Promise<ISaidasForm> => {
  const item: ISaidasForm = await db.Findbyid(id)

  payload = { ...item, dataEntrada: payload.dataEntrada }

  try {
    await db.Update(id, payload)
    return payload
  } catch (error) {
    throw errors.ErrorCadastrarSaida    
  }   

}

const Delete = async (idMotorista: number): Promise<void> => {

  try {
     await db.Delete(idMotorista)    
  } catch (error) {
    throw errors.ErrorDeletarSaida    
  }   
}

const ForenKey = async (
  key: keyof ISaidasForm,
  value: any
): Promise<boolean> => {
  const saidas: ISaidasForm[] = await db.Find(KEY)

  const fk = (item:any) => item[key] === value
  const items = saidas.filter(fk).length

  if (items > 0) Promise.reject(true)
  return false
  
}

const listarMotoristaVeiculo = async (idMotorista:number, idVeiculo:number): Promise<any> => {
 
  const motorista: IMotoristas = await db.Findbyid(idMotorista)
  const veiculo: IVeiculos     = await db.Findbyid(idVeiculo)
 
  return {
    motorista,
    veiculo, 
  }
  
}

const services: ISaidasServices = {
  Find,
  Update,
  Create,
  Delete,
  FindByid,
  ForenKey,
}

export default services
