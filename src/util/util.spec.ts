import { FormatDatePtBr, FormatUrlParams, FormatDateUs } from './'

describe('Utils', () => {
  it('FormatDateUs entrada new Date(2020,1,1) saída 2020-02-01', () => {
    const date = new Date(2020, 1, 1)
    const newDate = FormatDateUs(date)
    expect(newDate).toBe('2020-02-01')
  })
  it('FormatDatePtBr entrada 2020-02-01 saída 01/02/2020', () => {
    const date = FormatDatePtBr('2020-02-01')
    console.log(date)
    expect(date).toBe('01/02/2020')
  })
  it('FormatUrlParams entrada {nome:"Marcus",sobrenome:"Antonio"} saída Marcus|Antonio', () => {
    const usuario = FormatUrlParams({ nome: 'Marcus', sobrenome: 'Antonio' })
    expect(usuario).toBe('Marcus|Antonio'.toUpperCase())
  })
})
