import database, { Storage } from './db'

import Motoristas from './motoristas'
import Veiculos from './veiculos'
import Saidas from './saidas'

const db = database({ ...Storage() })

const services = {
  MotoristasServices: Motoristas(db),
  VeiculosServices: Veiculos(db),
  SaidasServices: Saidas(db),
}

export default services
