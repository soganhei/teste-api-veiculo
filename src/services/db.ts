export interface IDatabase {
  [index: number]: any
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
  db[payload.id] = payload
  return Object.is(db[payload.id], payload)
}

const Find = (db: IDatabase) => async (key: string): Promise<any[]> => {
  return Object.values(db).filter((item) => FindKeys(item, key))
}

export const FindKeys = (item: any, key: string) => item.key === key

const Findbyid = (db: IDatabase) => async (id: number): Promise<any> => {
  const item = db[id]
  if (item === undefined) {
    return Promise.reject('Não encontrado')
  }
  return { ...item }
}

const Update = (db: IDatabase) => async (
  id: number | any,
  value: any
): Promise<boolean> => {
  db[id] = value
  return Object.is(db[id], value)
}

const Delete = (db: IDatabase) => async (id: number): Promise<boolean> => {
  delete db[id]

  if (db[id] !== undefined) {
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

export const Storage = (): IDatabase => {
  return {} as IDatabase
}

export default (storage: IDatabase) => {
  const services: IDatabaseServices = {
    Create: Create(storage),
    Find: Find(storage),
    Findbyid: Findbyid(storage),
    Update: Update(storage),
    Delete: Delete(storage),
    ForenKey: ForenKey(storage),
  }
  return services
}
