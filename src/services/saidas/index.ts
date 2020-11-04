import { IDatabaseServices } from '../db'

import {   
  ISaidas,
  ISaidasForm,
  ISaidasServices,
} from '../../schemas'
import { FormatDatePtBr } from '../../util'

import errors from './errors'

export const KEY = 'saidas'

interface IKeyValue {
  [index: string]: any
}

const Find = (db: IDatabaseServices) => async (): Promise<ISaidas[]> => {
  const saidas: ISaidasForm[] = await db.Find(KEY)
  
  const promises = saidas.map(ListarSaidas(db))

  const items = await Promise.all(promises)
  return items
}
 
const FindByid = (db: IDatabaseServices) => async (
  id: number
): Promise<ISaidas> => {
  try {
    const response: ISaidasForm = await db.Findbyid(id)

    const { motorista, veiculo } = await ListarMotoristaVeiculo(db)(
      response.idMotorista,
      response.idVeiculo
    )
    return Object.assign({}, response, {
      motorista: {...motorista},
      veiculo: {...veiculo},
    })
  } catch (error) {
    throw error
  }
}

const Create = (db: IDatabaseServices) => async (
  payload: ISaidasForm
): Promise<ISaidasForm> => {
  try {
    const isMV = await VMNaoCadastrado(db)(
      payload.idMotorista,
      payload.idVeiculo
    )
    if (isMV) {
      throw errors.ErrorVMNaoCadastrado
    }

    const dataSaida = new Date().toJSON().slice(0, 10)

    const isSaida = await SaidaCadastrada(db)(
      payload.idMotorista,
      payload.idVeiculo,
      dataSaida
    )
    if (isSaida) {
      throw errors.ErrorSaidaCadastrada
    }

    const id = Math.floor(new Date().getTime() / 1000)

    payload.id = id
    payload.dataEntrada = ''
    payload.dataSaida = dataSaida
    payload.dataCriacao = new Date().toString()

    payload.key = KEY

    const novo = await db.Create(payload)
    if (!novo) {
      throw errors.ErrorCadastrarSaida
    }
    return payload
  } catch (error) {
    throw error
  }
}

const Update = (db: IDatabaseServices) => async (
  payload: ISaidasForm,
  id: number
): Promise<ISaidasForm> => {
  try {
    const response: ISaidasForm = await db.Findbyid(id)
    const data = Object.assign({}, response, {
      dataEntrada: payload.dataEntrada,
    })

    const atualizar = await db.Update(id, data)
    if (!atualizar) {
      throw errors.ErrorAtualizarSaida
    }
    return data
  } catch (error) {
    throw error
  }
}

const Delete = (db: IDatabaseServices) => async (
  idMotorista: number
): Promise<void> => {
  try {
    const deletado = await db.Delete(idMotorista)
    if (!deletado) {
      throw errors.ErrorDeletarSaida
    }
  } catch (error) {
    throw error
  }
}

export const FormatDate = () => (item:IKeyValue): IKeyValue => ({ [item[0]]: FormatDatePtBr(item[1] || ''),})

export const ListarSaidas = (db: IDatabaseServices) => async (
  item: ISaidas | any  
): Promise<ISaidas> => {
  
  const { motorista, veiculo } = await ListarMotoristaVeiculo(db)(
    item.idMotorista,
    item.idVeiculo
  )
  const veiculoMotorista = { veiculo: {...veiculo}, motorista: {...motorista} }

  
  const date: IKeyValue = {}
  date['dataSaida'] = item.dataSaida
  date['dataEntrada'] = item.dataEntrada
   
  const dates = Object.entries(date).map(FormatDate)
  return Object.assign({}, item, veiculoMotorista, ...dates)
}

export const ListarMotoristaVeiculo = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<any> => {
  const { motorista, veiculo } = await ForeignKey(db)(idMotorista, idVeiculo)
  return Object.assign({}, { motorista: motorista, veiculo: veiculo })
}

export const VMNaoCadastrado = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
): Promise<boolean> => {
  try {
    const items = { idMotorista, idVeiculo }

    return Object.values(items)
      .map(IsByid(db))
      .some((item) => !item)
  } catch (error) {
    throw error
  }
}

export const SaidaCadastrada = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number,
  dataSaida: string
): Promise<boolean> => {
  const items = { dataSaida, idMotorista, idVeiculo }

  return Object.entries(items)
  .map(ValidarSaidaCadastrada(db,KEY))
  .some((item) => !item)
}

export const IsByid = (db: IDatabaseServices) => async (id: number): Promise<boolean> => {
  const response = await db.Findbyid(id)
  return Object.values(response).length === 0
}

export const ValidarSaidaCadastrada = (db: IDatabaseServices,key:string) => async (item:any): Promise<boolean> =>  await db.ForenKey(item[1], key, item[0])


export const ForeignKey = (db: IDatabaseServices) => async (
  idMotorista: number,
  idVeiculo: number
) => {
  const foreignKeys: IKeyValue = {}
  foreignKeys['motorista'] = idMotorista
  foreignKeys['veiculo'] = idVeiculo

  const promises = Object.entries(foreignKeys).map(ForeignKeyValue(db))

  const items = await Promise.all(promises)
  return Object.assign({}, ...items)
}
export const ForeignKeyValue = 
(db: IDatabaseServices) => 
async (item:IKeyValue): Promise<IKeyValue> => 
({ [item[0]]: await db.Findbyid(item[1]) })

export default (db: IDatabaseServices): ISaidasServices => {
  return {
    Find: Find(db),
    Update: Update(db),
    Create: Create(db),
    Delete: Delete(db),
    FindByid: FindByid(db),
  }
}
