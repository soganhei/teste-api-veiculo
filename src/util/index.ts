//Retornar YYYY-MM-DD
export const FormatDateUs = (date: Date): string => date.toJSON().slice(0, 10)

//Entrada YYYY-MM-DD
//Retorna DD/MM/YYYY
export const FormatDatePtBr = (date: string): string =>
  date
    .split('-')
    .sort(() => -1)
    .join('/')

export const FormatUrlParams = (params: object) =>
  Object.values(params)
    .map((value) => `${value}`.toUpperCase())
    .join('|')
