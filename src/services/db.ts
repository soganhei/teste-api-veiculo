  
export let database = new Array()

const Create = (payload:any): null | Error =>{

    const t = database.length
    const n = database.push(payload)
    
    if(n < t){
        return new Error("Erro para criar novo registro")
    }
    return null
}

const Find = (key:String):[] =>{
    
     return  database.reduce((acc, item)=>{

            if(item.key === key){
                acc.push(item)
            }
            return acc; 
     },[])
}

const Findbyid = (id:Number): any | Error =>{

    const index = findIndex(id)
    if(index instanceof Error){
        return index
    }
    return database[index]  
}

const Update = (id:Number | any, value:any):  null | Error =>{

    const index = findIndex(id)
    if(index instanceof Error){
        return index
    }

    database[index] = value
    return null

}

const Delete = (id:Number): null | Error =>{

    
    const index = findIndex(id)
    if(index instanceof Error){
        return index
    }
            
    delete database[index]
    return null    

}

const findIndex = (id:Number): keyof[] | Error =>{

    let index = 0

    database.forEach((item,idx) => {

        if(item.id === id){
            index = idx
            return
        }
    }) 
    
    if(index === 0 && database[index] === undefined){
        return new Error(`Registro ${id} não encontrado`)
    }
    return index
}

export default {
    Create, 
    Find, 
    Findbyid, 
    Update, 
    Delete, 
}

 