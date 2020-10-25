
//Retornar YYYY-MM-DD
export const FormatDate = (date:Date):String =>{
    return date.toJSON().slice(0,10)
}

//Retorna DD/MM/YYYY
export const FormatDatePtBr = (date:String):String =>{

    if(date == undefined){
        return ""
    }
    const d = date.split('-')
    return `${d[2]}/${d[1]}/${d[0]}`
}