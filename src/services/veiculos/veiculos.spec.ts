
import {IVeiculos} from '../../schema'
import db from '../db'

const veiculo = {
    id:2,
    placa:"XXX-MMM",
    cor:"Azul",
    marca:"BMW", 
    key:"test-veiculo",
    dataCriacao:new Date("2020-10-26T04:36:35.395Z")
}

describe("veiculos",()=>{

       it("Criar novo veiculo",()=>{

           const payload:IVeiculos = veiculo

           const novoVeiculo  = db.Create(payload)           
           expect(payload).toEqual(novoVeiculo)

       })
       it("Listar veiculos",()=>{
            
           const veiculos: IVeiculos[] = [veiculo]

           const items = db.Find("test-veiculo")
           expect(veiculos).toEqual(items)

       })
       it("Listar veiculo byID",()=>{

            const itemVeiculo: IVeiculos = db.Findbyid(2)
            expect(veiculo).toEqual(itemVeiculo)

       })
       it("Atualizar veiculo",()=>{

            const payload = {
                ...veiculo,
                placa:"XXX-DBX",
                cor:"Preta"
            }

            const itemVeiculo = db.Update(2,payload)
            expect(payload).toEqual(itemVeiculo)

       })
       it("Deletar veiculo",()=>{

        db.Delete(2)
        const items = db.Find("test-veiculo")
        
        expect([]).toEqual(items)

        })

})