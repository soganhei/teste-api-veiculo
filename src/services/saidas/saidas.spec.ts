import Services,{KEY} from './'
import errors from './errors'
import {IMotoristas,IVeiculos, ISaidas, ISaidasForm} from '../../schemas'

import db from '../db'

describe('Saídas',()=>{

      const id =  Math.floor(new Date().getTime() / 1000)
      const idMotorista = id + 1
      const idVeiculo   = id + 2

      db.Create({
            key:'motoristas', 
            id: idMotorista, 
      })

      db.Create({
            key: 'veiculos', 
            id: idVeiculo, 
      })

      const payload:ISaidasForm = {
           id, 
           key: KEY, 
           idMotorista, 
           idVeiculo, 
           dataCriacao: new Date(), 
           dataSaida: '2020-01-01',
           motivoSaida: 'xxx', 
           dataEntrada: '2020-01-02', 
      }

      it('Nova saída', async ()=>{

        const response = await Services.Create(payload)
        expect(response).toEqual(payload)

      })

      it('Listar saídas', async ()=>{

          const response = await Services.Find()           
          expect(response.length).toBe(1)

      })

      it('Listar saída byid', async ()=>{
           
          const response = await Services.FindByid(id)
          expect([response.idMotorista, response.idVeiculo]).toEqual([idMotorista, idVeiculo])
      })

})