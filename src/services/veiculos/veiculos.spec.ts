import Services,{KEY} from './'
import errors from './errors'
import {IVeiculos} from '../../schemas'
import db from '../db'

const id = Math.floor(new Date().getTime() / 1000)

describe('Veículos', ()=>{

    const payload: IVeiculos = {
        id, 
        key: KEY+'_test', 
        marca: 'BMW', 
        cor:'Branca', 
        placa: 'XXX-XX2', 
        dataCriacao: new Date(),
    }
 
    it('Criar novo veículo', async ()=>{
         
           const response = await Services.Create(payload)
           expect(response).toEqual(payload)

    })

    it('Listar Veículos', async()=>{
          
        const response = await Services.Find()
        expect(response.length).toBe(1)
    })

    it('Validar veículo não cadastrado', async ()=>{
           
        const response = await Services.IsPlaca('XXX-XXX')
        expect(response).toBe(false) 

    })

    it('Validar veículo cadastrado', async ()=>{
           
        const response = await Services.IsPlaca('XXX-XX2')
        expect(response).toBe(true) 

    }) 

    it('Buscar veículo por placa', async ()=>{

         let response = await Services.Find({placa: 'XXXX-X'})
         expect(response).toEqual([])

         response = await Services.Find({placa:'XXX-XX2'})
         expect(response.length).toBe(1)
    })

    it('Buscar veículo por marca', async ()=>{

        let response = await Services.Find({marca: 'Azul'})
        expect(response).toEqual([])

        response = await Services.Find({marca:'BMW'})
        expect(response.length).toBe(1)
   })

    it('Listar veículo by id', async ()=>{
  
        const response = await Services.FindByid(id)
        expect(response).toEqual(payload)

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
             expect(error).toBe(errors.ErrorListarVeiculo)
        }
    })

})