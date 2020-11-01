//Retornar YYYY-MM-DD
export const FormatDate = (date: Date): string => {
  return date.toJSON().slice(0, 10)
}

//Entrada YYYY-MM-DD
//Retorna DD/MM/YYYY
export const FormatDatePtBr = (date: string): string => {
  if (date == undefined) {
    return ''
  }
  const d = date.split('-')
  return `${d[2]}/${d[1]}/${d[0]}`
}
