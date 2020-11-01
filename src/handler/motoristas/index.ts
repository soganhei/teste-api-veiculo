import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import {
  IMotoristasServices,
  IMotoristas,  
} from '../../schemas'

import errors from '../../services/motoristas/errors'

export interface IHandler {
  MotoristasServices: IMotoristasServices   
}

let handler: IHandler

const NewHandler = (h: IHandler) => {
  handler = h

  const router = express()
 
  router
    .post('/motoristas', Create)
    .get('/motoristas', Find)
    .get('/motoristas/:id', FindByid)
    .put('/motoristas/:id', Update)
    .delete('/motoristas/:id', Delete)

   
  return router
}

const Find = async (req: Request, res: Response) => {
  const query = req.query

  try {
    const response = await handler.MotoristasServices.Find(query)
    res.status(StatusCodes.OK)
    res.send(response)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST)
    res.send({
      message: 'Erro para listar motoristas',
    })
  }
}

const FindByid = async (req: Request, res: Response) => {
  
  const idMotorista = parseInt(req.params.id)
  
  try {
    const response = await handler.MotoristasServices.FindByid(idMotorista)
    
    res.status(StatusCodes.OK)
    res.send(response)
  } catch (error) {
    const message = {error:''}
  
    switch (error) {
      case errors.ErrorListarMotorista:
        message.error = `Error para listar motorista ${idMotorista}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send(message)
  }
}

const Create = async (req: Request, res: Response) => {
  const payload: IMotoristas = req.body

  try {
    const response = await handler.MotoristasServices.Create(payload)
    res.status(StatusCodes.CREATED)
    res.send(response)
  } catch (error) {

    const message = {error:''}

    switch (error) {
      case errors.ErrorMotoristaCadastrado:
        message.error = `Motorista ${payload.nome} já cadastrado`
        break
      case errors.ErrorCadastrarMotorista:
        message.error = `Erro para cadatrar motorista ${payload.nome}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send(message)
  }
}

const Update = async (req: Request, res: Response) => {
  const idMotorista = parseInt(req.params.id)

  const payload: IMotoristas = req.body

  try {
    await handler.MotoristasServices.Update(payload, idMotorista)
    res.status(StatusCodes.OK)
    res.send(payload)
  } catch (error) {
    
    const message = {error:''}

    switch (error) {
      case errors.ErrorAtualizarMotorista:
        message.error = `Error para atualizar motorista ${payload.nome}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send(message)
  }
}

const Delete = async (req: Request, res: Response) => {
  
  const idMotorista = parseInt(req.params.id)
  try {
    
    await handler.MotoristasServices.Delete(idMotorista)

    res.status(StatusCodes.NO_CONTENT)
    res.send(null)

  } catch (error) {
    
    const message = {error:''}

    switch (error) {
      case errors.ErrorMotoristaRelacionado:
        message.error = `Erro para deletar motorista ${idMotorista}. Contem saídas vinculadas!`
        break
      case errors.ErrorDeletarMotorista:
        message.error = `Erro para deletar motorista ${idMotorista}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send(message)
  }
}

export default { NewHandler }
