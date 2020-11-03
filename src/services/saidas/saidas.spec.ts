import database, { IDatabase } from '../db'

import app, { KEY } from './'
import { ISaidasForm, IMotoristas, IVeiculos } from '../../schemas'

const storagedb = {} as IDatabase
const db = database(storagedb)

const Services = app(db)

const setPayload = () => {
  const id = Math.floor(new Date().getTime() / 1000)

  const payload: ISaidasForm = {
    id,
    key: KEY,
    motivoSaida: 'xxx',
    idMotorista: id + 1,
    idVeiculo: id + 2,
    dataCriacao: new Date().toString(),
    dataSaida: '2020-01-01',
    dataEntrada: '2020-01-02',
  }
  return payload
}

describe('Saídas', () => {
  it('Nova saída', async () => {
    
    const payload = setPayload()

    db.Create({
      key: 'motoristas',
      id: payload.idMotorista,
    })

    db.Create({
      key: 'veiculos',
      id: payload.idVeiculo,
    })

    const response = await Services.Create(payload)
    expect(response).toEqual(payload)
  })

  it('Listar saídas', async () => {
    const response = await Services.Find()
    expect(response.length).toBe(1)
  })

  it('Listar saída byid', async () => {
    const { id, idMotorista, idVeiculo } = setPayload()

    const response = await Services.FindByid(id)
    expect([response.idMotorista, response.idVeiculo]).toEqual([
      idMotorista,
      idVeiculo,
    ])
  })

  it('Deletar saida', async () => {
    const { id } = setPayload()

    await Services.Delete(id)

    try {
      await Services.FindByid(id)
    } catch (error) {
      expect(error).toBe('Não encontrado')
    }
  }) 

})
