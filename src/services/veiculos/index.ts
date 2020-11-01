import db, { database } from '../db'
import { IVeiculos, IVeiculosServices } from '../../schemas'
import SaidasServices from '../saidas'

import errors from './errors'

interface IParams {
  placa?: string
  marca?: string
  cor?: string
}

export const KEY = 'veiculos'

const Find = async (params?: IParams): Promise<IVeiculos[]> => {
  
  const veiculos: IVeiculos[] = await db.Find(KEY)
  
  const upperCase = (text:string) => text.toUpperCase()

  const search = Object.values(params || {}).map( value => upperCase(value) ).join('|')
   
  const searchVeiculo = (item:IVeiculos) =>{

    const label = upperCase(`${item.placa}|${item.marca}|${item.cor}`)
    if (label.indexOf(search) !== -1)  return item

  }

  const items = veiculos.filter(searchVeiculo)
  return items
}

const FindByid = async (id: number): Promise<IVeiculos> => {

  try {
        
    const response: IVeiculos = await db.Findbyid(id)
    return response

  } catch (error) {
    throw errors.ErrorListarVeiculo
    
  } 
   
}

const Create = async (payload: IVeiculos): Promise<IVeiculos> => {
   
  try {
 
    const isPlaca  = await IsPlaca(payload.placa)
    if(isPlaca){
      throw errors.ErrorVeiculoCadastrado
    }
    
    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataCriacao = new Date()

    payload.key = KEY

    await db.Create(payload)
    return payload

  } catch (error) {

    switch(error){
       case errors.ErrorVeiculoCadastrado:
       throw error        
       default:
        throw errors.ErrorCadastrarVeiculo      
    }
    
  } 
   
}

const Update = async (payload: IVeiculos, id: number): Promise<IVeiculos> => {
    
  try {

    const response = await db.Findbyid(id)

    const data = {
      ...response,
      marca: payload.marca,
      cor: payload.cor,
      placa: payload.placa,
    }

    await db.Update(id, data)
    return data

  } catch (error) {
    throw errors.ErrorAtualizarVeiculo
    
  } 
 
}

const Delete = async (idVeiculo: number): Promise<void> => {
  
  try {
    
    const isPlaca = await SaidasServices.ForenKey('idVeiculo', idVeiculo)
    if (isPlaca) {
      throw errors.ErrorVeiculoRelacionado
    }
    
    await db.Delete(idVeiculo)

  } catch (error) {
    throw errors.ErrorDeletarVeiculo    
  }
   
}

const IsPlaca = async (placa: string): Promise<boolean> => {

  const veiculos: IVeiculos[] = await db.Find(KEY)

  const isPlaca = (item:IVeiculos) => item.placa === placa
  const items = veiculos.filter(isPlaca).length

  if (items > 0) return true
  return false

}

const services: IVeiculosServices = {
  Find,
  Update,
  Create,
  Delete,
  FindByid,
  IsPlaca,
}

export default services
