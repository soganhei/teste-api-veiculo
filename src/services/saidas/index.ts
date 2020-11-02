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

  const listSaidas = async (item: ISaidas | any, db: IDatabaseServices): Promise<ISaidas> => {
    
    const { motorista, veiculo } = await listarMotoristaVeiculo(db)(
      item.idMotorista,
      item.idVeiculo
    )
    const mv    = {veiculo: veiculo, motorista: motorista}
    const date  = {dataSaida: FormatDatePtBr(item.dataSaida), dataEntrada: FormatDatePtBr(item.dataEntrada || '')}
    return Object.assign({},item,mv,date)
  }

  const promises = saidas.map( item => listSaidas(item,db) )

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
    return  Object.assign({},response,{motorista: motorista, veiculo: veiculo})
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
    payload.dataCriacao = new Date().toString()
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
    motorista:{...motorista},
    veiculo:{...veiculo},
  }
}

const validarVMNaoCadastrado = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<boolean> => {
  
  try {

    const motorista = await  db.Findbyid(idMotorista)
    const veiculo = await db.Findbyid(idVeiculo)

    const isItem = (item:any) => Object.values(item).length === 0

    if(isItem(motorista) && isItem(veiculo)) return true
    return false
      
    
  } catch (error) {
    throw error
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
