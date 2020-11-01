import Services,{KEY} from './'
import errors from './errors'
import {IMotoristas} from '../../schemas'
import db from '../db'



describe('Motoristas', ()=>{
  
       const id = Math.floor(new Date().getTime() / 1000)

       const payload: IMotoristas = {
           id, 
           key: KEY,
           nome:'Marcus',
           dataCriacao: new Date()
       }
 
      it('Criar novo motorista',async ()=>{
               
        const response = await Services.Create(payload)
        expect([payload.nome,payload.key]).toEqual([response.nome,response.key])

      })

      it('Validar motorista cadastrado',async ()=>{

        const response = await Services.IsNome('Marcus')
        expect(true).toBe(response)
       
      })

      it('Validar motorista não cadastrado',async ()=>{

        const response = await Services.IsNome('Marcus Antonio')
        expect(false).toBe(response)

      })
        

      it('Listar motoristas',async ()=>{

        const response = await Services.Find()
        expect(1).toBe(response.length)
             
      })

      it('Buscar motorista por nome',async ()=>{

        let response = await Services.Find({nome:'Antonio'})
        expect([]).toEqual(response)

        response = await Services.Find({nome:'Marcus'})
        expect(1).toBe(response.length)

             
      })

      it('Listar motorista byid', async ()=>{

        await db.Create(payload)

        const response = await Services.FindByid(id)
        expect(payload).toEqual(response)

      })

      it('Atualizar motorista byid', async ()=>{
 
        await Services.Update({
            ...payload, 
            nome:'Marcus Antonio',
        },id)

        const response = await Services.FindByid(id)
        expect('Marcus Antonio').toBe(response.nome)

      })

      it('Deletar motorista',async ()=>{

            await Services.Delete(id)

            try {
              await Services.FindByid(id)
            } catch (error) {
              expect(errors.ErrorListarMotorista).toBe(error)
            }
      })

})