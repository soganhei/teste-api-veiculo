import express = require('express')

import Handler from './handler'

const app = express()

app.use((req, res, next) => {
  app.disable('x-powered-by')

  res.header('X-Powered-By', 'App v0.0.1')

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-type, Accept'
  )
  next()
})

app.use(Handler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
