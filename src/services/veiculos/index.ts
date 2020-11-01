import db from '../db'
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

  const response = await db.Findbyid(id)

  if (response instanceof Error) {
    throw errors.ErrorListarVeiculo
  }

  const item: IVeiculos = await response
  return item
}

const Create = async (payload: IVeiculos): Promise<IVeiculos> => {
  const isPlaca = IsPlaca(payload.placa)
  if (!isPlaca) {
    throw errors.ErrorVeiculoCadastrado
  }

  const id = Math.floor(new Date().getTime() / 1000)

  payload.id = id
  payload.dataCriacao = new Date()

  payload.key = KEY

  try {
    await db.Create(payload)
    return payload

  } catch (error) {
    throw errors.ErrorCadastrarVeiculo
    
  } 
   
}

const Update = async (payload: IVeiculos, id: number): Promise<IVeiculos> => {
  
  let response = await db.Findbyid(id)
  if(response instanceof Error){
     throw errors.ErrorListarVeiculo
  }

  payload = {
    ...response,
    marca: payload.marca,
    cor: payload.cor,
    placa: payload.placa,
  }

  response = await db.Update(id, payload)
  if (response instanceof Error) {
    throw errors.ErrorAtualizarVeiculo
  }
  return payload
}

const Delete = async (idVeiculo: number): Promise<void> => {

  const isPlaca = await SaidasServices.ForenKey('idVeiculo', idVeiculo)
  if (isPlaca) {
    throw errors.ErrorVeiculoRelacionado
  }

  try {
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
