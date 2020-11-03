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
  const idMotorista = parseInt(req.params.id)

  try {
    const response = await handler.SaidasServices.FindByid(idMotorista)
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Create = (handler: IHandler) => async (req: Request, res: Response) => {
  const payload: ISaidasForm = {...req.body}

  const date = FormatDate(new Date())

  try {
    const response = await handler.SaidasServices.Create(payload)

    res.status(StatusCodes.CREATED)
    res.send(response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Update = (handler: IHandler) => async (req: Request, res: Response) => {
  const idMotorista = parseInt(req.params.id)

  const payload: ISaidasForm = {...req.body}

  try {
    const response = await handler.SaidasServices.Update(payload, idMotorista)
    res.status(StatusCodes.OK)
    res.send(payload)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const Delete = (handler: IHandler) => async (req: Request, res: Response) => {
  const idSaida = parseInt(req.params.id)

  try {
    await handler.SaidasServices.Delete(idSaida)
    httpRespose(res, StatusCodes.NO_CONTENT, {})
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const httpRespose = (res: Response, status: number, body: {}) =>
  res.status(status).send(body)

export default { NewHandler }
