import {ILogs,ILogsServices} from '../../schema'
 
interface IParams {
    nome?:String, 
}

import db from "../db"

const key =  'logs' 

const Find = ():ILogs[] =>{
 
    const items: [] = db.Find(key)
    return items; 
}

const services: ILogsServices = {
    Find,
}
export default services