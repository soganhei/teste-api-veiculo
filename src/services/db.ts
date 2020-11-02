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
  const keys = (item: any, key: string) => item.key === key
  return Object.values(db).filter((item) => keys(item, key))
}

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
  delete db[id]
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
  const isfk = (item: any, table: string, column: string, id: any) =>
    item.key === table && item[column] === id
  return Object.values(db).some((item) => isfk(item, table, column, id))
}

export default () => {

  const db = {} as IDatabase

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
