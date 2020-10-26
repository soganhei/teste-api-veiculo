
import {IMotorista} from '../../estrutura'
import db from '../db'

const motorista = {
    id:1,
    nome:"Marcus", 
    key:"test-motorista",
    dataCriacao:new Date("2020-10-26T04:36:35.395Z")
}

describe("motoristas",()=>{

       it("Criar novo motorista",()=>{

           const payload:IMotorista = motorista

           const novoVeiculo  = db.Create(payload)           
           expect(payload).toEqual(novoVeiculo)

       })
       it("Listar motoristas",()=>{
            
           const veiculos: IMotorista[] = [motorista]

           const items = db.Find("test-motorista")
           expect(veiculos).toEqual(items)

       })
       it("Listar motorista byID",()=>{

            const itemMotorista: IMotorista = db.Findbyid(1)
            expect(motorista).toEqual(itemMotorista)

       })
       it("Atualizar motorista",()=>{

            const payload = {
                ...motorista,
                nome:"Marcus Antonio"
            }

            const itemMotorista = db.Update(1,payload)
            expect(payload).toEqual(itemMotorista)

       })
       it("Deletar motorista",()=>{

        db.Delete(1)
        const items = db.Find("test-motorista")
        
        expect([]).toEqual(items)

        })

})