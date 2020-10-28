import request from 'supertest'

import {ILogs,ILogsServices} from '../../schema'
import logs from './'

const dbMock:ILogsServices = {
      Find: ():ILogs[] =>{
            //console.log("db mock")
            return []
      }
}
 
const app = logs.NewHandler({
    LogsServices:dbMock, 
})

describe('Logs',()=>{
       it('Listar logs',(done)=>{
        
           request(app)
           .get("/logs")
           .expect(200,done)

       })
})
