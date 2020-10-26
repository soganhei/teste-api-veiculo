
import {IFormSaidaVeiculo,ISaidaVeiculos,IMotorista,IVeiculo} from '../../estrutura'
import db from '../db'

const motorista = {
    id:4, 
    nome:"Marcus",
    key:"test-motorista",
    dataCriacao:new Date("2020-10-26T04:36:35.395Z")
}

const veiculo = {
    id:5,
    placa:"XXX-MMM",
    cor:"Azul",
    marca:"BMW", 
    key:"test-veiculo",
    dataCriacao:new Date("2020-10-26T04:36:35.395Z")
}

const saida = {
    id:3,
    idMotorista:4,
    idVeiculo:5,
    motivoSaida:"Viagem à SP", 
    dataSaida:"2020-10-26",
    dataEntrada:"",
    key:"test-saida",
    dataCriacao:new Date("2020-10-26T04:36:35.395Z")
}

describe("saidas",()=>{

       it("Criar nova saida",()=>{

           const payload:IFormSaidaVeiculo = saida

           const novoMotorista = db.Create(motorista)
           expect(motorista).toEqual(novoMotorista)  

           const novoVeiculo = db.Create(veiculo)
           expect(veiculo).toEqual(novoVeiculo)  

           const novaSaida  = db.Create(payload)           
           expect(payload).toEqual(novaSaida)

       })
       it("Listar saidas",()=>{
            
           const itemSaida: ISaidaVeiculos[] = [{
               ...saida,
               motorista,
               veiculo, 
            }]

           const saidas:ISaidaVeiculos[] = db.Find("test-saida")

           let items : ISaidaVeiculos[] = []

           saidas.forEach((item)=>{
               
                  const {idMotorista,idVeiculo} = item
                  const m : IMotorista = db.Findbyid(idMotorista)
                  const v : IVeiculo = db.Findbyid(idVeiculo)

                  items.push({
                      ...item, 
                      motorista: m, 
                      veiculo: v, 
                  })
           })

           expect(itemSaida).toEqual(items)

       })
       it("Listar saida byID",()=>{

            const itemSaida: IFormSaidaVeiculo = db.Findbyid(3)
            expect(saida).toEqual(itemSaida)

       })
       it("Atualiar saida",()=>{

            const payload = {
                ...saida,
                dataEntrada:"2020-10-27",
            }

            const itemSaida = db.Update(3,payload)
            expect(payload).toEqual(itemSaida)

       })
       it("Deletar saida",()=>{

        db.Delete(3)
        db.Delete(4)
        db.Delete(5)

        const itemsMotorista = db.Find("test-motorista")
        expect([]).toEqual(itemsMotorista)

        const itemsVeiculo = db.Find("test-veiculo")
        expect([]).toEqual(itemsVeiculo)

        const itemsSaida = db.Find("test-saida")
        expect([]).toEqual(itemsSaida)

        })

})