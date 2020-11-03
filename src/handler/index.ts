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
motoristas(app)

const veiculos = Veiculos.NewHandler({
  VeiculosServices: Services.VeiculosServices,
})
veiculos(app)

const saidas = Saidas.NewHandler({
  SaidasServices: Services.SaidasServices,
})
saidas(app)
export default app
