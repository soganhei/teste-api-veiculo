import database, { IDatabase } from './db'

const storagedb = {} as IDatabase
const db = database(storagedb)

describe('Database key/value', () => {
  it('Criar registro', async () => {
    const usuario =  await db.Create({
      id: 1,
      nome: 'Marcus',
      key: 'teste',
    })

    const usuario2 = await db.Create({
      id: 2,
      nome: 'Antonio',
      key: 'teste',
    })
    expect([usuario,usuario2]).toEqual([true,true])

  })

  it('Listar registro', async () => {
    const clientes = [
      {
        id: 1,
        nome: 'Marcus',
        key: 'teste',
      },
      {
        id: 2,
        nome: 'Antonio',
        key: 'teste',
      },
    ]

    const items = await db.Find('teste')
    expect(items).toEqual(clientes)
  })
  it('Listar registro by id', async () => {
    const cliente = {
      id: 1,
      nome: 'Marcus',
      key: 'teste',
    }
    const item = await db.Findbyid(1)
    expect(item).toEqual(cliente)
  })
  it('Atualizar registro by id', async () => {
    const cliente = {
      id: 1,
      nome: 'Marcus Antonio',
      key: 'teste',
    }

    const alterado = await db.Update(1, cliente)
    expect(alterado).toBe(true)

    const item = await db.Findbyid(1)
    expect(item.nome).toBe('Marcus Antonio')
  })
  it('Deletar registro', async () => {

    const deletado =  await db.Delete(1)
    expect(deletado).toBe(true)

    const items = await db.Find('teste')
    expect(items.length).toBe(1)
  })
})
