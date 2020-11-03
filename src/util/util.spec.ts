import { FormatDatePtBr, FormatUrlParams } from './'

describe('Utils', () => {
  it('FormatDatePtBr entrada 2020-02-01 saída 01/02/2020', () => {
    const date = FormatDatePtBr('2020-02-01')
    expect(date).toBe('01/02/2020')
  })
  it('FormatUrlParams entrada {nome:"Marcus",sobrenome:"Antonio"} saída Marcus|Antonio', () => {
    const usuario = FormatUrlParams({ nome: 'Marcus', sobrenome: 'Antonio' })
    expect(usuario).toBe('Marcus|Antonio'.toUpperCase())
  })
})
