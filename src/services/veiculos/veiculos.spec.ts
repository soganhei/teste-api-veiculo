import database,{IDatabase} from '../db'

import app, { KEY } from './'
import errors from './errors'
import { IVeiculos } from '../../schemas'

const storagedb = {} as IDatabase
const db = database(storagedb)

const Services = app(db)

const setPayload = () =>{

  const id = Math.floor(new Date().getTime() / 1000)
  
  const payload: IVeiculos = {
    id,
    key: KEY,
    marca: 'BMW',
    cor: 'Branca',
    placa: 'XXX-XX2',
    dataCriacao: new Date().toString(),
  }
  return payload

}

describe('Veículos', () => {

  it('Criar novo veículo', async () => {

    const payload = setPayload()
    const response = await Services.Create(payload)
    expect(response).toEqual(payload)
  })

  it('Listar Veículos', async () => {
    const response = await Services.Find()
    expect(response.length).toBe(1)
  })

  it('Validar veículo não cadastrado', async () => {
    const response = await Services.IsPlaca('XXX-XXX')
    expect(response).toBe(false)
  })

  it('Validar veículo cadastrado', async () => {
    const response = await Services.IsPlaca('XXX-XX2')
    expect(response).toBe(true)
  })

  it('Buscar veículo por placa', async () => {
    let response = await Services.Find({ placa: 'XXXX-X' })
    expect(response).toEqual([])

    response = await Services.Find({ placa: 'XXX-XX2' })
    expect(response.length).toBe(1)
  })

  it('Buscar veículo por marca', async () => {
    let response = await Services.Find({ marca: 'Azul' })
    expect(response).toEqual([])

    response = await Services.Find({ marca: 'BMW' })
    expect(response.length).toBe(1)
  })

  it('Listar veículo by id', async () => {

    const payload = setPayload()

    const response = await Services.FindByid(payload.id)
    expect(response).toEqual(payload)
  })
  it('Atualizar veículo', async () => {

    const payload = setPayload()

    await Services.Update(
      {
        ...payload,
        placa: 'XXX-2',
      },
      payload.id
    )

    const response = await Services.FindByid(payload.id)
    expect('XXX-2').toBe(response.placa)
  })

  it('Deletar veículo', async () => {

    const {id} = setPayload()

    await Services.Delete(id)

    try {
      await Services.FindByid(id)
    } catch (error) {
      expect(error).toBe(errors.ErrorListarVeiculo)
    }
  })
})
