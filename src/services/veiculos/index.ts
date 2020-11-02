import { IDatabase, IDatabaseServices } from '../db'

import { IVeiculos, IVeiculosServices } from '../../schemas'

import { KEY as SaidasKey } from '../saidas'
import errors from './errors'

interface IParams {
  placa?: string
  marca?: string
  cor?: string
}

export const KEY = 'veiculos'

const Find = (db: IDatabaseServices) => async (
  params?: IParams
): Promise<IVeiculos[]> => {
  const veiculos: IVeiculos[] = await db.Find(KEY)

  const upperCase = (text: string) => text.toUpperCase()

  const search = Object.values(params || {})
    .map((value) => upperCase(value))
    .join('|')

  const searchVeiculo = (item: IVeiculos, search: string) => {
    const label = upperCase(`${item.placa}|${item.marca}|${item.cor}`)
    if (label.indexOf(search) !== -1) return item
  }
  const items = veiculos.filter((item) => searchVeiculo(item, search))
  return items
}

const FindByid = (db: IDatabaseServices) => async (
  id: number
): Promise<IVeiculos> => {
  try {
    const response: IVeiculos = await db.Findbyid(id)
    return {...response}
  } catch (error) {
    throw errors.ErrorListarVeiculo
  }
}

const Create = (db: IDatabaseServices) => async (
  payload: IVeiculos
): Promise<IVeiculos> => {
  try {
    const isPlaca = await IsPlaca(db)(payload.placa)
    if (isPlaca) {
      throw errors.ErrorVeiculoCadastrado
    }

    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataCriacao = new Date().toString()

    payload.key = KEY

    await db.Create(payload)
    return payload
  } catch (error) {
    switch (error) {
      case errors.ErrorVeiculoCadastrado:
        throw error
      default:
        throw errors.ErrorCadastrarVeiculo
    }
  }
}

const Update = (db: IDatabaseServices) => async (
  payload: IVeiculos,
  id: number
): Promise<IVeiculos> => {
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

const Delete = (db: IDatabaseServices) => async (
  idVeiculo: number
): Promise<void> => {
  try {
    const isPlaca = await db.ForenKey(idVeiculo, SaidasKey, 'idVeiculo')
    if (isPlaca) {
      throw errors.ErrorVeiculoRelacionado
    }

    await db.Delete(idVeiculo)
  } catch (error) {
    throw errors.ErrorDeletarVeiculo
  }
}

const IsPlaca = (db: IDatabaseServices) => async (
  placa: string
): Promise<boolean> => {
  const veiculos: IVeiculos[] = await db.Find(KEY)

  const isPlaca = (item: IVeiculos, placa: string) => item.placa === placa
  return veiculos.some((item) => isPlaca(item, placa))
}

export default (db: IDatabaseServices): IVeiculosServices => {
  return {
    Find: Find(db),
    Update: Update(db),
    Create: Create(db),
    Delete: Delete(db),
    FindByid: FindByid(db),
    IsPlaca: IsPlaca(db),
  }
}
