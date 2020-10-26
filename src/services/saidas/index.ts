
import {IMotorista, IVeiculo,ISaidaVeiculos,IFormSaidaVeiculo} from '../../estrutura'

import {FormatDate,FormatDatePtBr} from '../../lib'

import db from "../db"

const KEY = 'saidas'

const Find = ():ISaidaVeiculos[] =>{

    const saidas: IFormSaidaVeiculo[] = db.Find(KEY)

    let items: ISaidaVeiculos[] = []

    saidas.forEach((item)=>{

            const {                
                idMotorista, 
                idVeiculo,                
                dataSaida, 
                dataEntrada, 
            } = item; 

            const motorista: IMotorista = db.Findbyid(idMotorista)
            const veiculo : IVeiculo = db.Findbyid(idVeiculo)

            items.push({
                ...item, 
                motorista, 
                veiculo,                 
                dataSaida: FormatDatePtBr(dataSaida), 
                dataEntrada: FormatDatePtBr(dataEntrada), 
            })

    })
    return items; 
}

const FindByid = (idSaida:Number):ISaidaVeiculos => {

    let item: ISaidaVeiculos  = db.Findbyid(idSaida) 

    const motorista: IMotorista = db.Findbyid(item.idMotorista)
    const veiculo : IVeiculo = db.Findbyid(item.idVeiculo)

    item.motorista = motorista
    item.veiculo= veiculo

    return item; 

}

const Create = (payload:IFormSaidaVeiculo):IFormSaidaVeiculo | null =>{

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao =  new Date()
    payload.dataSaida = FormatDate(new Date())
  
    payload.key = KEY
 
    return db.Create(payload); 
    
}

const Update = (payload:IFormSaidaVeiculo,idMotorista:Number):IFormSaidaVeiculo | null =>{

    const item: IFormSaidaVeiculo = db.Findbyid(idMotorista)
        
    payload = {
        ...item, 
        dataEntrada: payload.dataEntrada,         
    }
      
    return db.Update(idMotorista, payload);   

}
 
const Delete = (idMotorista:Number):Boolean =>{
                      
    db.Delete(idMotorista)
    return true; 

}

const IsItem = (column: keyof IFormSaidaVeiculo, value: any):Boolean =>{

    const items: IFormSaidaVeiculo[] = db.Find(KEY)

    const item = items.filter((item)=> {return item[column] == value})

    if(item.length > 0){
        return true; 
    }
    return false; 
}

export default {
    Find, 
    Update, 
    Create, 
    Delete, 
    FindByid, 
    IsItem, 

}