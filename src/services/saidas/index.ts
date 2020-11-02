import { IDatabaseServices } from '../db'

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

const Find = (db: IDatabaseServices) => async (): Promise<ISaidas[]> => {
  const saidas: ISaidasForm[] = await db.Find(KEY)

  const listSaidas = async (item: ISaidas | any): Promise<ISaidas> => {
    const { idMotorista, idVeiculo, dataSaida, dataEntrada } = item
    const { motorista, veiculo } = await listarMotoristaVeiculo(db)(
      idMotorista,
      idVeiculo
    )

    return {
      ...item,
      veiculo,
      motorista,
      dataSaida: FormatDatePtBr(dataSaida),
      dataEntrada: FormatDatePtBr(dataEntrada || ''),
    }
  }

  const promises = saidas.map(listSaidas)

  const items = await Promise.all(promises)
  return items
}

const FindByid = (db: IDatabaseServices) => async (
  id: number
): Promise<ISaidas> => {
  try {
    const response: ISaidasForm = await db.Findbyid(id)
    const { motorista, veiculo } = await listarMotoristaVeiculo(db)(
      response.idMotorista,
      response.idVeiculo
    )

    return {
      ...response,
      motorista,
      veiculo,
    }
  } catch (error) {
    throw error
  }
}

const Create = (db: IDatabaseServices) => async (
  payload: ISaidasForm
): Promise<ISaidasForm> => {
  try {
    const isMV = await validarVMNaoCadastrado(db)(
      payload.idMotorista,
      payload.idVeiculo
    )
    if (isMV) {
      throw errors.ErrorVMNaoCadastrado
    }

    const isSaida = await validarSaidaCadastrada(db)(
      payload.idMotorista,
      payload.idVeiculo
    )
    if (isSaida) {
      throw errors.ErrorSaidaCadastrada
    }

    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataCriacao = new Date()
    payload.dataSaida = FormatDate(new Date())
    payload.dataEntrada = ''

    payload.key = KEY

    await db.Create(payload)
    return payload
  } catch (error) {
    switch (error) {
      case errors.ErrorSaidaCadastrada:
        throw error
      case errors.ErrorVMNaoCadastrado:
        throw error
      default:
        throw errors.ErrorCadastrarSaida
    }
  }
}

const Update = (db: IDatabaseServices) => async (
  payload: ISaidasForm,
  id: number
): Promise<ISaidasForm> => {
  try {
    const response: ISaidasForm = await db.Findbyid(id)
    const data = { ...response, dataEntrada: payload.dataEntrada }

    await db.Update(id, data)
    return data
  } catch (error) {
    throw errors.ErrorCadastrarSaida
  }
}

const Delete = (db: IDatabaseServices) => async (
  idMotorista: number
): Promise<void> => {
  try {
    await db.Delete(idMotorista)
  } catch (error) {
    throw errors.ErrorDeletarSaida
  }
}

const listarMotoristaVeiculo = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<any> => {
  const motorista: IMotoristas = await db.Findbyid(idMotorista)
  const veiculo: IVeiculos = await db.Findbyid(idVeiculo)

  return {
    motorista,
    veiculo,
  }
}

const validarVMNaoCadastrado = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<boolean> => {
  const motorista = db.Findbyid(idMotorista)
  const veiculo = db.Findbyid(idVeiculo)

  try {
    Promise.all([motorista, veiculo])
    return false
  } catch (error) {
    return true
  }
}

const validarSaidaCadastrada = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<boolean> => {
  const dataSaida = FormatDate(new Date())

  const motorista = await db.ForenKey(idMotorista, KEY, 'idMotorista')
  const veiculo = await db.ForenKey(idVeiculo, KEY, 'idVeiculo')
  const data = await db.ForenKey(dataSaida, KEY, 'dataSaida')

  if (!motorista && !veiculo && !data) {
    return false
  }
  return true
}

export default (db: IDatabaseServices): ISaidasServices => {
  return {
    Find: Find(db),
    Update: Update(db),
    Create: Create(db),
    Delete: Delete(db),
    FindByid: FindByid(db),
  }
}
