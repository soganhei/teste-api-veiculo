export interface IDatabase {
   storage: Map<any, any>
}
 

export interface IDatabaseServices {
  Create(payload: any): Promise<boolean>
  Find(key: string): Promise<any[]>
  Findbyid(key: number): Promise<any>
  Update(key: number, value: any): Promise<boolean>
  Delete(key: number): Promise<boolean>
  ForenKey(id: any, table: string, column: string): Promise<boolean>
}

export const ErrorNovoRegistro = 'ErrorNovoRegistro'

const Create = (db: IDatabase) => async (payload: any): Promise<boolean> => {
  
  db.storage.set(payload.id,payload)
  return db.storage.has(payload.id)

}

const Find = (db: IDatabase) => async (key: string): Promise<any[]> => {
  return [...db.storage.values()].filter((item) => FindKeys(item, key))    
}

export const FindKeys = (item: any, key: string) => item.key === key

const Findbyid = (db: IDatabase) => async (id: number): Promise<any> => {
  const item = db.storage.get(id)
  if (item === undefined) {
    return Promise.reject('Não encontrado')
  }
  return { ...item }
}

const Update = (db: IDatabase) => async (
  id: number | any,
  value: any
): Promise<boolean> => {
  db.storage.set(id,value)
  return db.storage.has(id)
}

const Delete = (db: IDatabase) => async (id: number): Promise<boolean> => {
   
  if (!db.storage.delete(id)) {
    return false
  }
  return true
}

const ForenKey = (db: IDatabase) => async (
  id: any,
  table: string,
  column: string
): Promise<boolean> => {
  return Object.values(db).some((item) => isFK(item, table, column, id))
}
export const isFK = (item: any, table: string, column: string, id: any) =>
  item.key === table && item[column] === id

export const Storage = ():IDatabase => {
  const db: IDatabase = {
    storage: new Map(),
  }
  return db
}

export default (db: IDatabase) => {
  const services: IDatabaseServices = {
    Create: Create(db),
    Find: Find(db),
    Findbyid: Findbyid(db),
    Update: Update(db),
    Delete: Delete(db),
    ForenKey: ForenKey(db),
  }
  return services
}
