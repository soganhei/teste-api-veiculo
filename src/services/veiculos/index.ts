
import db from '../db'
import { IVeiculos, IVeiculosServices } from '../../schema'

 
interface IParams {
    placa?:String,
    marca?:String,
    cor?:String
}

const KEY = 'veiculos'

const Find = (params?:IParams):IVeiculos[] => {
    
    const veiculos: IVeiculos[] = db.Find(KEY)

    const items: IVeiculos[] = []

    veiculos.forEach(item => {

    const search = []

    const label = `${item.placa}|${item.marca}|${item.cor}`.toUpperCase()
    
    if(params?.placa !== undefined){
        search.push(params?.placa)
    }

    if(params?.marca !== undefined){
        search.push(params?.marca)
    }

    if(params?.cor !== undefined){
        search.push(params?.cor)
    }

    const s = search.join('|').toUpperCase()
    
    if(label.indexOf(s) !== -1){
        items.push(item)
    }

    })

    if(items.length > 0){
        return items
    }

    return veiculos 
}

const FindByid = (idVeiculo:Number):IVeiculos => {

    const item: IVeiculos = db.Findbyid(idVeiculo)
    return item

}

const Create = (payload:IVeiculos):IVeiculos | Error =>{
 
    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao = new Date()
  
    payload.key = KEY

    const response = db.Create(payload)
    if(response instanceof Error){
        return response
    }

    return payload
}

const Update = (payload:IVeiculos, id:Number):IVeiculos | Error => {

    const item: IVeiculos = db.Findbyid(id)
    
    payload = {
        ...item, 
        marca: payload.marca,
        cor: payload.cor, 
        placa: payload.placa,  
    }      
    const response = db.Update(id, payload)   
    if(response instanceof Error){
        return response
    }
    return payload

}

const Delete = (idVeiculo:Number): null | Error => {
    return db.Delete(idVeiculo)
}

const IsPlaca = (placa:String):Boolean =>{
    
    const veiculos: IVeiculos[] = db.Find(KEY)

    const items = veiculos.filter((item) => { return item.placa === placa })

    if(items.length > 0) return true
    
    return false 
}


const services: IVeiculosServices = {
    Find, 
    Update, 
    Create, 
    Delete, 
    FindByid,
}

export default services
