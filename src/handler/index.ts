import express = require('express')

const app = express()

app.use(express.json())

import Services from '../services'

import Motoristas from './motoristas'
import Veiculos from './veiculos'
import Saidas from './saidas'

const motoristas = Motoristas.NewHandler({
  MotoristasServices: Services.MotoristasServices,   
})
app.use(motoristas)

const veiculos = Veiculos.NewHandler({
  VeiculosServices: Services.VeiculosServices,
})
app.use(veiculos)

const saidas = Saidas.NewHandler({
  SaidasServices: Services.SaidasServices,
  VeiculosServices: Services.VeiculosServices,
  MotoristasServices: Services.MotoristasServices,
})
app.use(saidas)

export default app
