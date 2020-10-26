
import {IMotorista,IFormSaidaVeiculo} from '../../estrutura'

 
interface IParams {
    nome?:String, 
}

import db from "../db"

const KEY =  'motoristas'

const Find = (params?:IParams):IMotorista[] =>{
 
    const motoristas: IMotorista[] = db.Find(KEY)

    let items: IMotorista[] = []

    motoristas.forEach((item) =>{

        const nome  = item.nome.toUpperCase()
        const pNome = `${params?.nome}`.toUpperCase()

        if(nome.indexOf(pNome) != -1){
            items.push(item)
        }

    })

    if(items.length > 0){
        return items
    }
    return motoristas 
}

const FindByid = (idMotorista:Number):IMotorista => {

    let item: IMotorista  = db.Findbyid(idMotorista) 
    return item; 

}

const Create = (payload:IMotorista):IMotorista | null =>{

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao =  new Date()
  
    payload.key = KEY

    return db.Create(payload); 
    
}

const Update = (payload:IMotorista,idMotorista:Number):IMotorista | null =>{

    const item: IMotorista = db.Findbyid(idMotorista)
    
    payload = {
        ...item, 
        nome: payload.nome, 
    }
    return db.Update(idMotorista, payload)

}

const Delete = (idMotorista:Number):Boolean =>{
                      
    db.Delete(idMotorista)
    return true; 
}

const IsNome = (nome:String):Boolean =>{
    
    const items: IMotorista[] = db.Find(KEY)

    const item = items.filter((item)=> {return item.nome == nome})

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
    IsNome,    

}