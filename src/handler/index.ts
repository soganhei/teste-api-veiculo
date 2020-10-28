import express = require("express")
import * as bodyParser from "body-parser"
 
const app = express();

app.use(bodyParser.json());

import Services from '../services'

import Motoristas from './motoristas'
//import Veiculos from './veiculos'
//import Saidas from './saidas'
import Logs from './logs'
 
const logs = Logs.NewHandler({
    LogsServices:Services.LogsServices,     
})
app.use(logs)

const motoristas = Motoristas.NewHandler({
    MotoristasServices:Services.MotoristasServices, 
    SaidasServices: Services.SaidasServices, 
})
app.use(motoristas)

 

/**app.post("/veiculos",Veiculos.Create)
app.get("/veiculos",Veiculos.Find)
app.get("/veiculos/:id",Veiculos.FindByid)
app.put("/veiculos/:id",Veiculos.Update)
app.delete("/veiculos/:id",Veiculos.Delete)

app.post("/saidas",Saidas.Create)
app.get("/saidas",Saidas.Find)
app.get("/saidas/:id",Saidas.FindByid)
app.put("/saidas/:id",Saidas.Update)
app.delete("/saidas/:id",Saidas.Delete) */

 
export default app