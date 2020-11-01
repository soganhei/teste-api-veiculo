
interface IDatabase {
  [index:number]: any
}

export let database = {} as IDatabase

export const ErrorNovoRegistro = 'ErrorNovoRegistro'

const Create = async (payload: any): Promise<void> => {

  const i = Object.keys(database).length
  database[payload.id] = payload

  const n = Object.keys(database).length

  if(i === n){
    return Promise.reject('Não cadastrado')
  } 

}

const Find = async (key: string): Promise<any[]> => {

  const keys = (item:any) => item.key === key
  return Object.values(database).filter(keys)

}

const Findbyid = async (id: number): Promise<any> => {
  
    const item = database[id]     
    if(item === undefined){
       return Promise.reject('Não encontrado')
    }
    return item
}

const Update = async (id: number | any, value: any): Promise<void> => {

  database[id] = value
  
  if(!Object.is(database[id], value)){
    return Promise.reject('Não Atualizado')
  }

}

const Delete = async (id: number): Promise<void> => {

  delete database[id] 
  
  if(database[id] !== undefined){
      return Promise.reject('Não deletado')
  }
   
}
 

export default {
  Create,
  Find,
  Findbyid,
  Update,
  Delete,
}
