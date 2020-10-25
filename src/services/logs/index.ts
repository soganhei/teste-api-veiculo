import {ILogs} from '../../estrutura'
 
interface IParams {
    nome?:String, 
}

import db from "../db"

const key =  'logs'

const Find = (params?:IParams):ILogs[] =>{

    const items: [] = db.Find(key)
    return items; 
}

const Create = (payload:ILogs) =>{

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao =  new Date()
  
    payload.key = key

    db.Create(payload)

}

export default {
    Find, 
    Create, 
}