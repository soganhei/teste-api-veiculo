  
export let database = new Array()

const Create = (value:any) =>{
    
      database.push(value)
      return value
}

const Find = (key:String):[] | any =>{
    
     return  database.reduce((acc, item)=>{

            if(item.key == key){
                acc.push(item)
            }
            return acc; 
     },[])
}

const Findbyid = (id:Number | any) =>{
    return database.filter((item)=> { return item.id === id })[0]   
}

const Update = (id:Number | any, value:any): any | null =>{

    let payload = {}

    database.forEach((item,idx) => {

        if(item.id == id){
            database[idx] = value
            payload = database[idx]
        }
    }) 
    return payload || null
}

const Delete = (id:Number | any) =>{
    
    database = database.reduce((acc,item) => {

        if(item.id != id){
                acc.push(item)
        }
        return acc;        
    },[]) 

}
 

export default {
    Create, 
    Find, 
    Findbyid, 
    Update, 
    Delete, 
}

 