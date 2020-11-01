import db from '../db'

import { IMotoristasServices, IMotoristas } from '../../schemas'
import SaidasServices from '../saidas'

import errors from './errors'

interface IParams {
  nome?: string
}

export const KEY = 'motoristas'

const Find = async (params?: IParams): Promise<IMotoristas[]> => {
  const motoristas: IMotoristas[] = await db.Find(KEY)
 
  const upperCase = (text:string) => text.toUpperCase()
 
  const search = Object.values(params || {}).map( value => upperCase(value) ).join('')

  const searchNome = (item:IMotoristas) => {

    const nome = upperCase(item.nome)
    if (nome.indexOf(search) !== -1)  return item

  }

  const items = motoristas.filter(searchNome)
  return items

}

const FindByid = async (id: number): Promise<IMotoristas> => {

  try {
     
    const response: IMotoristas = await db.Findbyid(id)
    return response

  } catch (error) {
      throw errors.ErrorListarMotorista        
  }
 
}

const Create = async (payload: IMotoristas): Promise<IMotoristas> => {
   
  try {

    const isNome = await IsNome(payload.nome)
    if (isNome) {
      throw errors.ErrorMotoristaCadastrado
    }

    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataCriacao = new Date()

    payload.key = KEY

    await db.Create(payload)
    return payload
  } catch (error) {
     throw error
  } 

}

const Update = async (
  payload: IMotoristas,
  id: number
): Promise<IMotoristas> => {

  try {
    
    const response = await db.Findbyid(id)
    const data = { ...response, nome: payload.nome }

    await db.Update(id, data)
    return data
  } catch (error) {
      throw error
  }
  
}

const Delete = async (idMotorista: number): Promise<void> => {

  const isMotorista = await SaidasServices.ForenKey('idMotorista', idMotorista)
   
  if (isMotorista) {
    throw errors.ErrorMotoristaRelacionado
  }

  try {

    await db.Delete(idMotorista)
    
  } catch (error) {
    throw errors.ErrorDeletarMotorista
    
  } 
  
}

const IsNome = async (nome: string): Promise<boolean> => {
  const motoristas: IMotoristas[] = await db.Find(KEY)

  const isNome = (item:IMotoristas) => item.nome === nome
  const items  = motoristas.filter(isNome).length

  if (items > 0) return true
  return false

}

const services: IMotoristasServices = {
  Find,
  Update,
  Create,
  Delete,
  FindByid,
  IsNome,
}

export default services
