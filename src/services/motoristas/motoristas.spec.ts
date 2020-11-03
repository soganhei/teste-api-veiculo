import database, { IDatabase } from '../db'

import errors from './errors'
import { IMotoristas } from '../../schemas'

import app, { KEY } from './'

const storagedb = {} as IDatabase
const db = database(storagedb)

const Services = app(db)

const setPyload = () => {
  const id = Math.floor(new Date().getTime() / 1000)

  const payload: IMotoristas = {
    id,
    key: KEY,
    nome: 'Marcus',
    dataCriacao: new Date().toString(),
  }
  return payload
}

describe('Motoristas', () => {
  it('Criar novo motorista', async () => {
    const payload = setPyload()

    const response = await Services.Create(payload)
    expect(response.id).toBe(payload.id)
  })

  it('Validar motorista cadastrado', async () => {
    const response = await Services.IsNome('Marcus')
    expect(response).toBe(true)
  })

  it('Validar motorista não cadastrado', async () => {
    const response = await Services.IsNome('Marcus Antonio')
    expect(response).toBe(false)
  })

  it('Listar motoristas', async () => {
    const response = await Services.Find()
    expect(response.length).toBe(1)
  })

  it('Buscar motorista por nome', async () => {
    let response = await Services.Find({ nome: 'Antonio' })
    expect(response).toEqual([])

    response = await Services.Find({ nome: 'Marcus' })
    expect(response.length).toBe(1)
  })

  it('Listar motorista byid', async () => {
    const payload = setPyload()

    const response = await Services.FindByid(payload.id)
    expect(response).toEqual(payload)
  })

  it('Atualizar motorista byid', async () => {
    const payload = setPyload()

    await Services.Update({ ...payload, nome: 'Marcus Antonio' }, payload.id)

    const response = await Services.FindByid(payload.id)
    expect(response.nome).toBe('Marcus Antonio')
  })

  it('Deletar motorista', async () => {
    const { id } = setPyload()

    await Services.Delete(id)

    try {
      await Services.FindByid(id)
    } catch (error) {
      expect(error).toBe(errors.ErrorListarMotorista)
    }
  })
})
