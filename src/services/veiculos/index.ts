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

  const items: IVeiculos[] = []

  const search = []

  if (params?.placa !== undefined) {
    search.push(params?.placa)
  }

  if (params?.marca !== undefined) {
    search.push(params?.marca)
  }

  if (params?.cor !== undefined) {
    search.push(params?.cor)
  }

  const s = search.join('|').toUpperCase()

  veiculos.forEach((item) => {
   
    const label = `${item.placa}|${item.marca}|${item.cor}`.toUpperCase()
 
    if (label.indexOf(s) !== -1) {
      items.push(item)
     }

  })

  if (items.length > 0 || search.length > 0) return items

  return veiculos
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

  const response = await db.Create(payload)
  if (response instanceof Error) {
    throw errors.ErrorCadastrarVeiculo
  }

  return payload
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

  const response = await db.Delete(idVeiculo)
  if (response instanceof Error) {
    throw errors.ErrorDeletarVeiculo
  }
}

const IsPlaca = async (placa: string): Promise<boolean> => {
  const veiculos: IVeiculos[] = await db.Find(KEY)

  const items = veiculos.filter( item => item.placa == placa)

  if (items.length > 0) {
    return true
  }
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
