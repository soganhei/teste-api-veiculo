

export interface IMotorista{
    id: Number, 
    nome: String,
    dataCriacao: Date, 
    key:String, 
}

export interface IVeiculo{
    id: Number, 
    marca: String, 
    placa: String, 
    cor: String, 
    dataCriacao?: Date, 
    key: String, 
}

export interface ISaidaVeiculos{
    id:Number,    
    idMotorista: Number, 
    idVeiculo:  Number, 
    dataSaida: String, 
    dataEntrada?: String, 
    motivoSaida?: String, 
    motorista:IMotorista, 
    veiculo: IVeiculo, 
    dataCriacao: Date, 

}

export interface IFormSaidaVeiculo{
    id:Number, 
    idMotorista: Number, 
    idVeiculo:  Number, 
    dataSaida: String, 
    dataEntrada: String, 
    motivoSaida: String, 
    dataCriacao: Date, 
    motorista: String, 
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