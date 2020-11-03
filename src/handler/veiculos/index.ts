import { Request, Response, IRouter } from 'express'
import { StatusCodes } from 'http-status-codes'

import { IVeiculos, IVeiculosServices } from '../../schemas'

import errors from '../../services/veiculos/errors'

export interface IHandler {
  VeiculosServices: IVeiculosServices
}

const NewHandler = (handler: IHandler) => (router: IRouter) => {
  router
    .post('/veiculos', Create(handler))
    .get('/veiculos', Find(handler))
    .get('/veiculos/:id', FindByid(handler))
    .put('/veiculos/:id', Update(handler))
    .delete('/veiculos/:id', Delete(handler))
  return router
}

const Find = (handler: IHandler) => async (req: Request, res: Response) => {
  const query = req.query

  try {
    const response = await handler.VeiculosServices.Find(query)
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    httpRespose(res, StatusCodes.BAD_REQUEST, { error })
  }
}

const FindByid = (handler: IHandler) => async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  try {
    const response = await handler.VeiculosServices.FindByid(idVeiculo)
    httpRespose(res, StatusCodes.OK, response)
  } catch (error) {
    switch (error) {
      case errors.ErrorListarVeiculo:
        httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Error para listar motorista ${idVeiculo}`,
        })
        return
    }
  }
}

const Create = (handler: IHandler) => async (req: Request, res: Response) => {
  const payload: IVeiculos = {...req.body}

  try {
    const response = await handler.VeiculosServices.Create(payload)
    httpRespose(res, StatusCodes.CREATED, response)
  } catch (error) {
    const status = StatusCodes.BAD_REQUEST

    switch (error) {
      case errors.ErrorVeiculoCadastrado:
        httpRespose(res, status, { error: `${payload.placa} já cadastrada` })
        return
      case errors.ErrorCadastrarVeiculo:
        httpRespose(res, status, {
          error: `Error para cadastrada veículo. Placa ${payload.placa}`,
        })
        return
    }
  }
}

const Update = (handler: IHandler) => async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  const payload: IVeiculos = {...req.body}

  try {
    await handler.VeiculosServices.Update(payload, idVeiculo)
    httpRespose(res, StatusCodes.OK, payload)
  } catch (error) {
    switch (error) {
      case errors.ErrorAtualizarVeiculo:
        httpRespose(res, StatusCodes.BAD_REQUEST, {
          error: `Error para atualizar veículo ${payload.placa}`,
        })
        return
    }
  }
}

const Delete = (handler: IHandler) => async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  try {
    await handler.VeiculosServices.Delete(idVeiculo)
    httpRespose(res, StatusCodes.NO_CONTENT, {})
  } catch (error) {
    const status = StatusCodes.BAD_REQUEST

    switch (error) {
      case errors.ErrorDeletarVeiculo:
        httpRespose(res, status, { error: 'Error para deletar veículo' })
        return
      case errors.ErrorVeiculoRelacionado:
        httpRespose(res, status, { error: 'Saídas relacionadas ao veículo' })
        return
    }
  }
}

const httpRespose = (res: Response, status: number, body: object) =>
  res.status(status).send(body)

export default { NewHandler }
