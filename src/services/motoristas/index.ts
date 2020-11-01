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

  const items: IMotoristas[] = []

  motoristas.forEach((item) => {

    const nome = item.nome.toUpperCase()
    const pNome = `${params?.nome}`.toUpperCase()

    if (nome.indexOf(pNome) !== -1) {
      items.push(item)
    }

  })

  if (items.length > 0 || params?.nome !== undefined) return items

  return motoristas
}

const FindByid = async (id: number): Promise<IMotoristas> => {

  const response = await db.Findbyid(id)
   
  if (response instanceof Error) {
    throw errors.ErrorListarMotorista
  }

  const item: IMotoristas = response
  return item
}

const Create = async (payload: IMotoristas): Promise<IMotoristas> => {
  const isNome = await IsNome(payload.nome)
  if (isNome) {
    throw errors.ErrorMotoristaCadastrado
  }

  const id = Math.floor(new Date().getTime() / 1000)

  payload.id = id
  payload.dataCriacao = new Date()

  payload.key = KEY

  const response = await db.Create(payload)
  if (response instanceof Error) {
    throw errors.ErrorCadastrarMotorista
  }
  return payload
}

const Update = async (
  payload: IMotoristas,
  id: number
): Promise<IMotoristas> => {

  let response = await db.Findbyid(id)
  if(response instanceof Error){
      throw errors.ErrorListarMotorista
  }

  payload = { ...response, nome: payload.nome }

  response = await db.Update(id, payload)
  if (response instanceof Error) {
    throw errors.ErrorAtualizarMotorista
  }

  return payload
}

const Delete = async (idMotorista: number): Promise<void> => {

  const isMotorista = await SaidasServices.ForenKey('idMotorista', idMotorista)
   
  if (isMotorista) {
    throw errors.ErrorMotoristaRelacionado
  }

  const response = await db.Delete(idMotorista)
  if (response instanceof Error) {
    throw errors.ErrorDeletarMotorista
  }
}

const IsNome = async (nome: string): Promise<boolean> => {
  const motoristas: IMotoristas[] = await db.Find(KEY)

  const items = motoristas.filter( item => item.nome == nome)

  if (items.length > 0) {
    return true
  }
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
