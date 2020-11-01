import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { IVeiculos, IVeiculosServices } from '../../schemas'

import errors from '../../services/veiculos/errors'

export interface IHandler {
  VeiculosServices: IVeiculosServices
}

let handler: IHandler

const NewHandler = (h: IHandler) => {
  handler = h

  const router = express()
  router
    .post('/veiculos', Create)
    .get('/veiculos', Find)
    .get('/veiculos/:id', FindByid)
    .put('/veiculos/:id', Update)
    .delete('/veiculos/:id', Delete)
  return router
}

const Find = async (req: Request, res: Response) => {
  const query = req.query

  try {
    const response = await handler.VeiculosServices.Find(query)

    res.status(StatusCodes.OK)
    res.send(response)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST)
    res.send({ message: error.message })
  }
}

const FindByid = async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  try {
    const response = await handler.VeiculosServices.FindByid(idVeiculo)

    res.status(StatusCodes.OK)
    res.send(response)
  } catch (error) {
    let message

    switch (error) {
      case errors.ErrorListarVeiculo:
        message = `Error para listar motorista ${idVeiculo}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send({ message })
  }
}

const Create = async (req: Request, res: Response) => {
  const payload: IVeiculos = req.body

  try {
    const response = await handler.VeiculosServices.Create(payload)
    res.status(StatusCodes.CREATED)
    res.send(response)
  } catch (error) {
    let message

    switch (error) {
      case errors.ErrorVeiculoCadastrado:
        message = `${payload.placa} já cadastrada`
        break
      case errors.ErrorCadastrarVeiculo:
        message = `Error para cadastrada veículo. Placa ${payload.placa}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send({ message })
  }
}

const Update = async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  const payload: IVeiculos = req.body

  try {
    await handler.VeiculosServices.Update(payload, idVeiculo)
    res.status(StatusCodes.OK)
    res.send(payload)
  } catch (error) {
    let message

    switch (error) {
      case errors.ErrorAtualizarVeiculo:
        message = `Error para atualizar veículo ${payload.placa}`
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send({ message })
  }
}

const Delete = async (req: Request, res: Response) => {
  const idVeiculo = parseInt(req.params.id)

  try {
    await handler.VeiculosServices.Delete(idVeiculo)

    res.status(StatusCodes.NO_CONTENT)
    res.send(null)
  } catch (error) {
    let message

    switch (error) {
      case errors.ErrorDeletarVeiculo:
        message = 'Error para deletar veículo'
        break
      case errors.ErrorVeiculoRelacionado:
        message = 'Saídas relacionadas ao veículo'
        break
      default:
        break
    }

    res.status(StatusCodes.BAD_REQUEST)
    res.send({ message })
  }
}

export default { NewHandler }
