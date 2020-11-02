import { IDatabaseServices } from '../db'

import { IMotoristasServices, IMotoristas } from '../../schemas'
import { KEY as SaidasKey } from '../saidas'

import errors from './errors'

interface IParams {
  nome?: string
}

export const KEY = 'motoristas'

const Find = (db: IDatabaseServices) => async (
  params?: IParams
): Promise<IMotoristas[]> => {
  const motoristas: IMotoristas[] = await db.Find(KEY)

  const upperCase = (text: string) => text.toUpperCase()

  const search = Object.values(params || {})
    .map((value) => upperCase(value))
    .join('')

  const searchNome = (item: IMotoristas, search: string) => {
    const nome = upperCase(item.nome)
    if (nome.indexOf(search) !== -1) return item
  }

  const items = motoristas.filter((item) => searchNome(item, search))
  return items
}

const FindByid = (db: IDatabaseServices) => async (
  id: number
): Promise<IMotoristas> => {
  try {
    const response: IMotoristas = await db.Findbyid(id)
    return {...response}
  } catch (error) {
    throw errors.ErrorListarMotorista
  }
}

const Create = (db: IDatabaseServices) => async (
  payload: IMotoristas
): Promise<IMotoristas> => {
  try {
    const isNome = await IsNome(db)(payload.nome)
    if (isNome) {
      throw errors.ErrorMotoristaCadastrado
    }

    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataCriacao = new Date().toString()

    payload.key = KEY

    await db.Create(payload)
    return payload
  } catch (error) {
    throw error
  }
}

const Update = (db: IDatabaseServices) => async (
  payload: IMotoristas,
  id: number
): Promise<IMotoristas> => {
  try {
    const response = await db.Findbyid(payload.id)
    const data = { ...response, nome: payload.nome }

    await db.Update(id, data)
    return data
  } catch (error) {
    throw error
  }
}

const Delete = (db: IDatabaseServices) => async (
  idMotorista: number
): Promise<void> => {
  try {
    const isMotorista = await db.ForenKey(idMotorista, SaidasKey, 'idMotorista')

    if (isMotorista) {
      throw errors.ErrorMotoristaRelacionado
    }
    await db.Delete(idMotorista)
  } catch (error) {
    throw errors.ErrorDeletarMotorista
  }
}

const IsNome = (db: IDatabaseServices) => async (
  nome: string
): Promise<boolean> => {
  const motoristas: IMotoristas[] = await db.Find(KEY)

  const isNome = (item: IMotoristas, nome: string) => item.nome === nome
  return motoristas.some((item) => isNome(item, nome))
}

export default (db: IDatabaseServices): IMotoristasServices => {
  const services = {
    Find: Find(db),
    Update: Update(db),
    Create: Create(db),
    Delete: Delete(db),
    FindByid: FindByid(db),
    IsNome: IsNome(db),
  }
  return services
}
