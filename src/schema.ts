
 
export interface IMotoristas{
    id: Number, 
    nome: String,
    dataCriacao: Date, 
    key:String, 
}

export interface IVeiculos{
    id: Number, 
    marca: String, 
    placa: String, 
    cor: String, 
    dataCriacao?: Date, 
    key: String, 
}

export interface ISaidas{
    id:Number,    
    idMotorista: Number, 
    idVeiculo:  Number, 
    dataSaida: String, 
    dataEntrada?: String, 
    motivoSaida?: String, 
    dataCriacao: Date, 
    veiculo: IVeiculos, 
    motorista:IMotoristas, 

}

export interface ISaidasForm{
    id:Number, 
    idMotorista: Number, 
    idVeiculo:  Number, 
    dataSaida: String, 
    dataEntrada: String, 
    motivoSaida: String, 
    dataCriacao: Date,     
    key:String, 
}

export interface ILogs{
    id?:Number, 
    key?:String, 
    method?:String, 
    error?: Boolean, 
    errorMessage?: String, 
    payload?: any, 
    dataCriacao?: Date, 
    table:String, 
}

export interface ILogsServices{
    Find():ILogs[]
}

export interface IMotoristasServices{
    Create(payload:IMotoristas): IMotoristas | Error,
    Find(params:any):IMotoristas[] | Error,
    FindByid(id:Number):IMotoristas | Error,
    Update(payload:IMotoristas,id:Number): IMotoristas | Error,
    Delete(id:Number): null | Error,

    IsNome(nome:String):Boolean
}

export interface IVeiculosServices{
    Create(payload:IVeiculos): IVeiculos | Error,
    Find():IVeiculos[] | Error,
    FindByid(id:Number):IVeiculos | Error,
    Update(payload:IVeiculos,id:Number): IVeiculos | Error,
    Delete(id:Number): null | Error,
}

export interface ISaidasServices{
    Create(payload:ISaidasForm): ISaidasForm | Error,
    Find():ISaidas[] | Error,
    FindByid(id:Number):ISaidas,
    Update(payload:ISaidasForm,id:Number): ISaidasForm | Error,
    Delete(id:Number): null | Error,
    ForenKey(key:keyof ISaidasForm,value:any): Boolean, 
}