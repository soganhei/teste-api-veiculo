
import {IVeiculo,IFormSaidaVeiculo} from '../../estrutura'

 
interface IParams {
    placa?:String, 
    marca?:String, 
    cor?:String, 
}

import db from "../db"

const KEY = "veiculos"

const Find = (params?:IParams):IVeiculo[] =>{
    
    const veiculos: IVeiculo[] = db.Find(KEY)

    const items: IVeiculo[] = []

    veiculos.forEach(item=>{

        let search = []

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

        const s = search.join("|").toUpperCase()
        
        if(label.indexOf(s) !== -1){
            items.push(item)
        }

    })

    if(items.length > 0){
        return items
    }

    return veiculos; 
}

const FindByid = (idVeiculo:Number):IVeiculo => {

    let item: IVeiculo  = db.Findbyid(idVeiculo) 
    return item; 

}

const Create = (payload:IVeiculo):IVeiculo | null =>{

    const id = Math.floor(new Date().getTime() / 1000)
         
    payload.id = id
    payload.dataCriacao =  new Date()
  
    payload.key = KEY

    return  db.Create(payload); 
    
}

const Update = (payload:IVeiculo,idVeiculo:Number):IVeiculo | null =>{

    const item: IVeiculo = db.Findbyid(idVeiculo)
    
    payload = {
        ...item, 
        marca: payload.marca,
        cor: payload.cor, 
        placa: payload.placa,  
    }   
   
    return  db.Update(idVeiculo, payload);   

}

const Delete = (idVeiculo:Number):Boolean =>{
                      
    db.Delete(idVeiculo)
    return true; 

}

const IsPlaca = (placa:String):Boolean =>{
    
    const items: IVeiculo[] = db.Find(KEY)

    const item = items.filter((item)=> {return item.placa === placa})

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
    IsPlaca, 
    

}