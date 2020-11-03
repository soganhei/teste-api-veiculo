import { Request, Response, IRouter } from 'express'
import { StatusCodes } from 'http-status-codes'

import { FormatDate } from '../../lib'

import { ISaidasForm, ISaidasServices } from '../../schemas'

export interface IHandler {
  SaidasServices: ISaidasServices
}

const NewHandler = (handler: IHandler) => (router: IRouter) => {
  router
    .post('/saidas', Create(handler))
    .get('/saidas', Find(handler))
    .get('/saidas/:id', FindByid(handler))
    .put('/saidas/:id', Update(handler))
    .delete('/saidas/:id', Delete(handler))
  return router
}

const Find = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const response = await handler.SaidasServices.Find()
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, error)
  }
}

const FindByid = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const idMotorista = parseInt(req.params.id)
    const response = await handler.SaidasServices.FindByid(idMotorista)
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Create = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const payload: ISaidasForm = { ...req.body }
    const response = await handler.SaidasServices.Create(payload)
    httpRespose(res, StatusCodes.CREATED, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Update = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const idMotorista = parseInt(req.params.id)
    const payload: ISaidasForm = { ...req.body }

    const response = await handler.SaidasServices.Update(payload, idMotorista)
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Delete = (handler: IHandler) => async (req: Request, res: Response) => {
  try {
    const idSaida = parseInt(req.params.id)
    await handler.SaidasServices.Delete(idSaida)
    httpRespose(res, StatusCodes.NO_CONTENT, {})
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const httpRespose = (res: Response, status: number, body: {}) =>
  res.status(status).send(body)

export default { NewHandler }
