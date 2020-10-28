
import { IMotoristas, IVeiculos, ISaidas, ISaidasForm, ISaidasServices } from '../../schema'

import { FormatDate, FormatDatePtBr } from '../../lib'

import db from '../db'

const KEY = 'saidas'

const Find = ():ISaidas[] => {

    const saidas: ISaidasForm[] = db.Find(KEY)

    const items: ISaidas[] = []

    saidas.forEach((item) => {

        const {
            idMotorista,
            idVeiculo,
            dataSaida,
            dataEntrada
        } = item

        const motorista: IMotoristas = db.Findbyid(idMotorista)
        const veiculo : IVeiculos = db.Findbyid(idVeiculo)

        items.push({
        ...item,
            veiculo,
            motorista,
            dataSaida: FormatDatePtBr(dataSaida),
            dataEntrada: FormatDatePtBr(dataEntrada)
        })

    })
    return items
}

const FindByid = (id:Number):ISaidas => {

    const item: ISaidas = db.Findbyid(id)

    const motorista: IMotoristas = db.Findbyid(item.idMotorista)
    const veiculo : IVeiculos = db.Findbyid(item.idVeiculo)

    return { ...item, motorista, veiculo }
}

const Create = (payload:ISaidasForm):ISaidasForm | Error => {

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao = new Date()
    payload.dataSaida = FormatDate(new Date())
  
    payload.key = KEY
 
    const response = db.Create(payload)
    if(response instanceof Error) {
        return response
    }
    return payload
}

const Update = (payload:ISaidasForm, id:Number):ISaidasForm | Error =>{

    const item: ISaidasForm = db.Findbyid(id)
        
    payload = { ...item, dataEntrada: payload.dataEntrada }
    const response = db.Update(id, payload)
    if(response instanceof Error){
        return response
    }
    return payload

}
 
const Delete = (idMotorista:Number): null | Error => {
    return  db.Delete(idMotorista)
}

const ForenKey = (key: keyof ISaidasForm, value: any):Boolean => {

    const saidas: ISaidasForm[] = db.Find(KEY)

    const items = saidas.filter((item) => { return item[key] === value })

    if(items.length > 0) return true
    
    return false
}


const services : ISaidasServices = {
    Find, 
    Update, 
    Create, 
    Delete, 
    FindByid, 
    ForenKey, 
}

export default services
