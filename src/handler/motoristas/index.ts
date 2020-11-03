import { IRouter, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { IMotoristasServices, IMotoristas } from '../../schemas'

import errors from '../../services/motoristas/errors'

export interface IHandler {
  MotoristasServices: IMotoristasServices
}

const NewHandler = (handler: IHandler) => (router: IRouter) => {
  router
    .post('/motoristas', Create(handler))
    .get('/motoristas', Find(handler))
    .get('/motoristas/:id', FindByid(handler))
    .put('/motoristas/:id', Update(handler))
    .delete('/motoristas/:id', Delete(handler))

  return router
}

const Create = (handler: IHandler) => async (req: Request, res: Response) => {
  const payload: IMotoristas = {...req.body}

  try {
    const response = await handler.MotoristasServices.Create(payload)
    return httpRespose(res, StatusCodes.CREATED, response)
  } catch (error) {
    switch (error) {
      case errors.ErrorMotoristaCadastrado:
        return httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Motorista ${payload.nome} já cadastrado`,
        })
      case errors.ErrorCadastrarMotorista:
        return httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Erro para cadatrar motorista ${payload.nome}`,
        })
    }
  }
}

const Find = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const query = req.query
    const response = await handler.MotoristasServices.Find(query)
    return httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    return httpRespose(res, StatusCodes.BAD_REQUEST, {
      error: 'Erro para listar motoristas',
    })
  }
}

const FindByid = (handler: IHandler) => async (req: Request, res: Response) => {
  const idMotorista = parseInt(req.params.id)

  try {
    const response = await handler.MotoristasServices.FindByid(idMotorista)
    return httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    switch (error) {
      case errors.ErrorListarMotorista:
        return httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Error para listar motorista ${idMotorista}`,
        })
    }
  }
}

const Update = (handler: IHandler) => async (req: Request, res: Response) => {
  const idMotorista = parseInt(req.params.id)
  const payload: IMotoristas = req.body

  try {
    await handler.MotoristasServices.Update(payload, idMotorista)
    return httpRespose(res, StatusCodes.OK, payload)
  } catch (error) {
    switch (error) {
      case errors.ErrorAtualizarMotorista:
        return httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Error para atualizar motorista ${payload.nome}`,
        })
    }
  }
}

const Delete = (handler: IHandler) => async (req: Request, res: Response) => {
  const idMotorista = parseInt(req.params.id)
  try {
    await handler.MotoristasServices.Delete(idMotorista)
    return httpRespose(res, StatusCodes.NO_CONTENT, {})
  } catch (error) {
    switch (error) {
      case errors.ErrorMotoristaRelacionado:
        return httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Erro para deletar motorista ${idMotorista}. Contem saídas vinculadas!`,
        })

      case errors.ErrorDeletarMotorista:
        httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Erro para deletar motorista ${idMotorista}`,
        })
        return
    }
  }
}

const httpRespose = (res: Response, status: number, body: {}) =>
  res.status(status).send(body)

export default { NewHandler }
