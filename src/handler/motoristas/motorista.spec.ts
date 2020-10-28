
import request from 'supertest'
import {StatusCodes} from 'http-status-codes';


import app from '../'

import Services from '../../services'

import {IMotorista} from '../../schema'
  
describe('Api motoristas', ()=>{

    let payload: IMotorista = {
        id: 1, 
        nome:'Marcus',
        key:'motoristas',
        dataCriacao: new Date(), 
    }

    it('POST /motoristas', async (done) =>{
                
        request(app)
        .post('/motoristas')      
        .send(payload)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)  
        .expect(StatusCodes.CREATED)
        .end((err, res)=>{
            if(err) return done(err)

            payload = {...res.body}
            done()
        })  

    })

    it('GET /motoristas', (done) =>{

        request(app)
        .get('/motoristas')      
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)  
        .expect(StatusCodes.OK,done)  
    }) 
    
    it('GET /motoristas/:id', (done) =>{

        const {id} = payload

        request(app)
        .get(`/motoristas/${id}`)      
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)  
        .expect(StatusCodes.OK)  
        .end((err, res)=>{
            if(err) return done(err)

            expect(payload).toEqual(res.body) 
            done()
        })  
    })

    it('PUT /motoristas/:id', (done) =>{

        const {id} = payload

        request(app)
        .put(`/motoristas/${id}`)      
        .send({...payload, nome:'Antonio Marcus'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)  
        .expect(StatusCodes.OK)  
        .end((err, res)=>{
            if(err) return done(err)

            expect('Antonio Marcus').toBe(res.body.nome) 
            done()
        })  
    })

    it('DELETE /motoristas/:id', (done) =>{

        const {id} = payload

        request(app)
        .delete(`/motoristas/${id}`)         
        .expect(StatusCodes.NO_CONTENT,done)  
         
    })

})

describe('API motoristas erros',()=>{

    let payload: IMotorista = {
        id: 1, 
        nome:'Marcus',
        key:'motoristas',
        dataCriacao: new Date(), 
    }

    beforeAll(()=>{
        Services.MotoristasServices.Create(payload)
    })

    it('POST /motoristas [Motorista existente]',(done)=>{
       
        request(app)
        .post('/motoristas')      
        .send(payload)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)  
        .expect(StatusCodes.BAD_REQUEST)
        .end((err, res)=>{
            if(err) return done(err)

            const message = '{"message":"Motorista Marcus já cadastrado!"}'
            expect(message).toBe(res.text)
            done()
        }) 

    })

})