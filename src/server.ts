import express = require("express");
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {      
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,DELETE,OPTIONS,POST,PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept")
    next()
})

import Motoristas from './handler/motoristas'
import Veiculos from './handler/veiculos'
import Saidas from './handler/saidas'


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


const port = process.env.PORT || 5000
app.listen(port,() => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

