import { IDatabaseServices } from '../db'
import { FormatDatePtBr } from '../../util'

import {ISaidas} from '../../schemas'

interface IKeyValue {
    [index: string]: any
}

export const FormatDate = (key: string, value: string): IKeyValue => ({
    [key]: FormatDatePtBr(value || ''),
  })
  
  export const ListarSaidas = (db: IDatabaseServices) => async (
    item: ISaidas | any  
  ): Promise<ISaidas> => {
    
    const { motorista, veiculo } = await ListarByid(db)( item.idMotorista, item.idVeiculo )
    const veiculoMotorista = { veiculo: veiculo, motorista: motorista }
  
    const date: IKeyValue = {}
    date['dataSaida']   = item.dataSaida
    date['dataEntrada'] = item.dataEntrada
  
    const dates = Object.entries(date).map((item) => FormatDate(...item))
    return Object.assign({}, item, veiculoMotorista, ...dates)
  }
  
  export const ListarByid = (db: IDatabaseServices) => async ( idMotorista: number, idVeiculo: number ): Promise<any> => {
    const { motorista, veiculo } = await ForeignKeyByid(db)(idMotorista, idVeiculo)
    return Object.assign({}, { motorista: motorista, veiculo: veiculo })
  }
  
  //Validar se o veículo ou motoristas não cadastrado
  export const ValidarMotoritaVeiculoNaoCadastrado = (db: IDatabaseServices) => async (
    idMotorista: number,
    idVeiculo: number
  ): Promise<boolean> => {
    try {
      const items = { idMotorista, idVeiculo }
  
      return Object.values(items)
        .map((id) => IsByid(db)(id))
        .some((item) => !item)
    } catch (error) {
      throw error
    }
  }
  
  export const ValidarSaidaCadastrada = (db: IDatabaseServices,key:string) => async (
    idMotorista: number,
    idVeiculo: number,
    dataSaida: string
  ): Promise<boolean> => {
    const items = { dataSaida, idMotorista, idVeiculo }
  
    return Object.entries(items)
      .map((item) => ForenKeys(db)(key, item[0], item[1]))
      .some((item) => !item)
  }
  
  export const IsByid = (db: IDatabaseServices) => async (
    id: number
  ): Promise<boolean> => {
    const response = await db.Findbyid(id)
    return Object.values(response).length === 0
  }
  
  export const ForenKeys = (db: IDatabaseServices) => async (
    key: string,
    column: string,
    id: any
  ): Promise<boolean> => {
    return await db.ForenKey(id, key, column)
  }
  
  export const ForeignKeyByid = (db: IDatabaseServices) => async (
    idMotorista: number,
    idVeiculo: number
  ) => {
    const foreignKeys: IKeyValue = {}
    foreignKeys['motorista'] = idMotorista
    foreignKeys['veiculo'] = idVeiculo
  
    const promises = Object.entries(foreignKeys).map((item) =>
      ForeignKeyValue(db)(...item)
    )
  
    const items = await Promise.all(promises)
    return Object.assign({}, ...items)
  }
  export const ForeignKeyValue = (db: IDatabaseServices) => async (
    key: string,
    value: number
  ): Promise<IKeyValue> => ({ [key]: await db.Findbyid(value) })
  