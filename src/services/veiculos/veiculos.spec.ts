import Services,{KEY} from './'
import errors from './errors'
import {IVeiculos} from '../../schemas'
import db from '../db'

const id = Math.floor(new Date().getTime() / 1000)

describe('Veículos', ()=>{

    const payload: IVeiculos = {
        id, 
        key: KEY, 
        marca: 'BMW', 
        cor:'Branca', 
        placa: 'XXX-XX2', 
        dataCriacao: new Date(),
    }
 
    it('Criar novo veículo', async ()=>{
         
           const response = await Services.Create(payload)
           expect([payload.placa,payload.key]).toEqual([response.placa,response.key])

    })

    it('Listar Veículos', async()=>{
          
        const response = await Services.Find()
        expect(1).toBe(response.length)
    })

    it('Validar veículo não cadastrado', async ()=>{
           
        const response = await Services.IsPlaca('XXX-XXX')
        expect(false).toBe(response) 

    })

    it('Validar veículo cadastrado', async ()=>{
           
        const response = await Services.IsPlaca('XXX-XX2')
        expect(true).toBe(response) 

    }) 

    it('Buscar veículo por placa', async ()=>{

         let response = await Services.Find({placa: 'XXXX-X'})
         expect([]).toEqual(response)

         response = await Services.Find({placa:'XXX-XX2'})
         expect(1).toBe(response.length)
    })

    it('Buscar veículo por marca', async ()=>{

        let response = await Services.Find({marca: 'Azul'})
        expect([]).toEqual(response)

        response = await Services.Find({marca:'BMW'})
        expect(1).toBe(response.length)
   })

    it('Listar veículo by id', async ()=>{

        await db.Create(payload)
 
        const response = await Services.FindByid(id)
        expect(payload).toEqual(response)

    })
    it('Atualizar veículo', async ()=>{
        
        await Services.Update({
             ...payload, 
             placa:'XXX-2',
        },id)

        const response = await Services.FindByid(id)
        expect('XXX-2').toBe(response.placa)

    })

    it('Deletar veículo', async ()=>{
         
        await Services.Delete(id)

        try {
            await Services.FindByid(id)
        } catch (error) {
             expect(errors.ErrorListarVeiculo).toBe(error)
        }
    })

})