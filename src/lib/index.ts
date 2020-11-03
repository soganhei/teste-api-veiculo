//Retornar YYYY-MM-DD
export const FormatDate = (date: Date): string => date.toJSON().slice(0, 10)

//Entrada YYYY-MM-DD
//Retorna DD/MM/YYYY
export const FormatDatePtBr = (date: string): string => {
  if (date === '') {
    return ''
  }
  const d = date.split('-')
  return `${d[2]}/${d[1]}/${d[0]}`
}
