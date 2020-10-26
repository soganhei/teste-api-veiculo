import express = require("express")
import * as bodyParser from "body-parser"
 
const app = express();

app.use(bodyParser.json());

import Motoristas from './motoristas'
import Veiculos from './veiculos'
import Saidas from './saidas'
import Logs from './logs'

app.post("/motoristas",Motoristas.Create)
app.get("/motoristas",Motoristas.Find)
app.get("/motoristas/:id",Motoristas.FindByid)
app.put("/motoristas/:id",Motoristas.Update)
app.delete("/motoristas/:id",Motoristas.Delete)

app.post("/veiculos",Veiculos.Create)
app.get("/veiculos",Veiculos.Find)
app.get("/veiculos/:id",Veiculos.FindByid)
app.put("/veiculos/:id",Veiculos.Update)
app.delete("/veiculos/:id",Veiculos.Delete)

app.post("/saidas",Saidas.Create)
app.get("/saidas",Saidas.Find)
app.get("/saidas/:id",Saidas.FindByid)
app.put("/saidas/:id",Saidas.Update)
app.delete("/saidas/:id",Saidas.Delete)

app.get("/logs",Logs.Find)

export default app