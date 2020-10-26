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

import handlers from './handler'
app.use(handlers)


const port = process.env.PORT || 5000
app.listen(port,() => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

