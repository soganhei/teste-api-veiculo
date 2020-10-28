
import db from '../db'

import { IMotoristasServices, IMotoristas } from '../../schema'

interface IParams {
    nome?:String
}

const KEY = 'motoristas'

const Find = (params?:IParams):IMotoristas[] => {

    const motoristas: IMotoristas[] = db.Find(KEY)

    const items: IMotoristas[] = []

    motoristas.forEach((item) =>{

        const nome = item.nome.toUpperCase()
        const pNome = `${params?.nome}`.toUpperCase()

        if(nome.indexOf(pNome) !== -1){
            items.push(item)
        }

    })

    if(items.length > 0){
        return items
    }
    return motoristas 
}

const FindByid = (id:Number):IMotoristas => {

    const item: IMotoristas = db.Findbyid(id)
    return item

}

const Create = (payload:IMotoristas):IMotoristas | Error =>{
 
    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao =  new Date()
  
    payload.key = KEY
 
    const response = db.Create(payload)
    if(response instanceof Error){
        return response
    }
    return payload
    
}

const Update = (payload:IMotoristas,id:Number): IMotoristas | Error =>{

  const item: IMotoristas = db.Findbyid(id)
  
  payload = { ...item, nome: payload.nome }

  const response = db.Update(id, payload)
  
  if(response instanceof Error){
    return response
  }
  
  return payload

}

const Delete = (idMotorista:Number): null | Error => {
  return db.Delete(idMotorista)
}

const IsNome = (nome:String):Boolean =>{
    
    const motoristas: IMotoristas[] = db.Find(KEY)

    const items = motoristas.filter((item) => { return item.nome === nome })

    if(items.length > 0) return true
    
    return false
}

const services: IMotoristasServices = {
  Find,
  Update,
  Create,
  Delete,
  FindByid,
  IsNome
}

export default services
