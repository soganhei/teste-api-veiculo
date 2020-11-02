import database,{Storage} from './db'
const db = database({...Storage()})

describe('Database key/value', () => {
  it('Criar registro', async () => {
    db.Create({
      id: 1,
      nome: 'Marcus',
      key: 'teste',
    })

    db.Create({
      id: 2,
      nome: 'Antonio',
      key: 'teste',
    })
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

    await db.Update(1, cliente)

    const item = await db.Findbyid(1)
    expect(item.nome).toBe('Marcus Antonio')
  })
  it('Deletar registro', async () => {
    await db.Delete(1)

    const items = await db.Find('teste')
    expect(items.length).toBe(1)
  })
})
