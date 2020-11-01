import request from 'supertest'
import { StatusCodes } from 'http-status-codes'

 
import {IMotoristas} from '../../schemas'
import app from '../'
  

describe('Acitons Motoristas',()=>{

    const id = (Math.floor(new Date().getTime() / 1000))

    const payload: IMotoristas = {
        id, 
        key: 'motoristas',
        nome:'Marcus',
        dataCriacao: new Date()
    }


     it('POST Criar novo motoristas', (done)=>{
            
        request(app)
        .post('/motoristas')
        .send(payload)
        .expect(StatusCodes.CREATED,done)
          
     })

     it('POST Validar motorista cadastrado',(done)=>{

        request(app)
        .post('/motoristas')
        .send(payload)
        .expect(StatusCodes.BAD_REQUEST,done)

     })

     it('GET Listar motoristas', (done) =>{

         request(app)
         .get('/motoristas')
         .expect(StatusCodes.OK)
         .then((response)=>{
            
            const data: IMotoristas[] = response.body 
            expect(1).toBe(data.length)
            done()
         })

     })

     it('GET Buscar motorista por nome', (done)=>{

         request(app)
         .get('/motoristas?nome=Marcus')
         .expect(StatusCodes.OK)
         .then((response)=>{
                
            const data: IMotoristas[] = response.body
            expect(1).toBe(data.length)
            done()
         })

         request(app)
         .get('/motoristas?nome=Antonio')
         .expect(StatusCodes.OK)
         .then((response)=>{
                
            const data: IMotoristas[] = response.body
            expect([]).toEqual(data)
            done()
         })

    })

    it('GET Listar motorista byid', async (done)=>{
            
            request(app)
            .get(`/motoristas/${id}`)
            .expect(StatusCodes.OK)
            .then((response)=>{
                   const {body} =response

                   expect(payload.id).toEqual(body.id)
                   done()
            })
             
    })
    
    it('PUT Atualizar motorista byid', (done)=>{

        const data = {
            ...payload, 
            nome:'Marcus Antonio',
        }

        request(app)
        .put(`/motoristas/${id}`)
        .send(data)
        .expect(StatusCodes.OK,done) 
        
    })
    it('Validar nome atualizado', (done)=>{
        
        request(app)
        .get(`/motoristas/${id}`)         
        .expect(StatusCodes.OK)
        .then((response)=>{
    
            const data: IMotoristas = response.body
            expect('Marcus Antonio').toBe(data.nome)
            done()
        })

    })
    it('DELETE Deletar motorista byid', (done)=>{

        request(app)
        .del(`/motoristas/${id}`)
        .expect(StatusCodes.NO_CONTENT,done)
    })

})