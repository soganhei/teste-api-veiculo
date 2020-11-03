import express = require('express')

import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import database, { IDatabase } from '../../services/db'

import { IMotoristas } from '../../schemas'
import handler from './'

const storagedb = {} as IDatabase
const db = database(storagedb)

import MotoristasServices from '../../services/motoristas'
const handlers = handler.NewHandler({
  MotoristasServices: MotoristasServices(db),
})

const route = express()
route.use(express.json())
const app = handlers(route)

const setPayload = () => {
  const id = Math.floor(new Date().getTime() / 1000)

  const payload: IMotoristas = {
    id,
    key: 'motoristas',
    nome: 'Marcus',
    dataCriacao: new Date().toDateString(),
  }
  return payload
}

describe('Acitons Motoristas', () => {
  it('POST Criar novo motoristas', (done) => {
    request(app)
      .post('/motoristas')
      .send(setPayload())
      .expect(StatusCodes.CREATED, done)
  })

  it('POST Validar motorista cadastrado', (done) => {
    request(app)
      .post('/motoristas')
      .send(setPayload())
      .expect(StatusCodes.BAD_REQUEST, done)
  })

  it('GET Listar motoristas', (done) => {
    request(app)
      .get('/motoristas')
      .expect(StatusCodes.OK)
      .then((response) => {
        const data: IMotoristas[] = response.body
        expect(1).toBe(data.length)
        done()
      })
  })

  it('GET Buscar motorista by nome', (done) => {
    request(app)
      .get('/motoristas?nome=Marcus')
      .expect(StatusCodes.OK)
      .then((response) => {
        const data: IMotoristas[] = response.body
        expect(1).toBe(data.length)
        done()
      })

    request(app)
      .get('/motoristas?nome=Antonio')
      .expect(StatusCodes.OK)
      .then((response) => {
        const data: IMotoristas[] = response.body
        expect([]).toEqual(data)
        done()
      })
  })

  it('GET Listar motorista byid', (done) => {
    const payload = setPayload()

    request(app)
      .get(`/motoristas/${payload.id}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        const { body } = response

        expect(payload.id).toEqual(body.id)
        done()
      })
  })

  it('PUT Atualizar motorista byid', (done) => {
    const payload = setPayload()

    const data = {
      ...payload,
      nome: 'Marcus Antonio',
    }
    request(app)
      .put(`/motoristas/${payload.id}`)
      .send(data)
      .expect(StatusCodes.OK, done)
  })

  it('Validar nome atualizado', (done) => {
    const payload = setPayload()

    request(app)
      .get(`/motoristas/${payload.id}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        const data: IMotoristas = response.body
        expect(data.nome).toBe('Marcus Antonio')
        done()
      })
  })
  it('DELETE Deletar motorista byid', (done) => {
    const { id } = setPayload()
    request(app).del(`/motoristas/${id}`).expect(StatusCodes.NO_CONTENT, done)
  })
})
