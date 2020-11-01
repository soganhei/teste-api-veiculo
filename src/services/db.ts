export let database = new Array()

export class ErrorNovoRegistro extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ErrorNovoRegistro'
  }
}

const Create = async (payload: any): Promise<Error> => {
  return new Promise((resolve, reject) => {
    const t = database.length
    const n = database.push(payload)

    if (n === t) {
      const err = new ErrorNovoRegistro()
      reject(err)
    }
    resolve(payload)
  })
}

const Find = async (key: string): Promise<[]> => {
  return database.reduce((acc, item) => {
    if (item.key === key) {
      acc.push(item)
    }
    return acc
  }, [])
}

const Findbyid = async (id: number): Promise<any | Error> => {
  
  try {

    const index = await findIndex(id)
    return database[index]
    
  } catch (error) {
     return new Error(`Não encontrado ${id}`)
  }

}

const Update = async (id: number | any, value: any): Promise<Error> => {
  const index = await findIndex(id)
  database[index] = value
  return value
}

const Delete = async (id: number): Promise<void | Error> => {

  
  const index = await findIndex(id)
  
  const key = parseInt(`${index}`)
  database.splice(key,1) 
   
}

const findIndex = async (id: number): Promise<keyof []> => {
  return new Promise((resolve, rejects) => {
    
    let index = 0

    database.forEach((item, idx) => {
      if (item.id === id) {       
        index = idx
        return
      }
    })

    if (index === 0 && database[index] === undefined) {
      rejects(`Registro ${id} não encontrado`)
    }
    resolve(index)
  })
}

export default {
  Create,
  Find,
  Findbyid,
  Update,
  Delete,
}
