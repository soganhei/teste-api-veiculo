export interface IMotoristas {
  id: number
  nome: string
  dataCriacao: string
  key: string
}

export interface IVeiculos {
  id: number
  marca: string
  placa: string
  cor: string
  dataCriacao?: string
  key: string
}

export interface ISaidas {
  id: number
  idMotorista: number
  idVeiculo: number
  dataSaida: string
  dataEntrada?: string
  motivoSaida?: string
  dataCriacao: string
  veiculo: IVeiculos
  motorista: IMotoristas
}

export interface ISaidasForm {
  id: number
  idMotorista: number
  idVeiculo: number
  dataSaida: string
  dataEntrada: string
  motivoSaida: string
  dataCriacao: string
  key: string
}

export interface ILogs {
  id?: number
  key?: string
  method?: string
  error?: boolean
  errorMessage?: string
  payload?: any
  dataCriacao?: Date
  table: string
}

export interface ILogsServices {
  Find(): ILogs[]
}

export interface IMotoristasServices {
  Create(payload: IMotoristas): Promise<IMotoristas>
  Find(params?: any): Promise<IMotoristas[]>
  FindByid(id: number): Promise<IMotoristas>
  Update(payload: IMotoristas, id: number): Promise<IMotoristas>
  Delete(id: number): Promise<void>

  IsNome(nome: string): Promise<boolean>
}

export interface IVeiculosServices {
  Create(payload: IVeiculos): Promise<IVeiculos>
  Find(params?: any): Promise<IVeiculos[]>
  FindByid(id: number): Promise<IVeiculos>
  Update(payload: IVeiculos, id: number): Promise<IVeiculos>
  Delete(id: number): Promise<void>

  IsPlaca(placa: string): Promise<boolean>
}

export interface ISaidasServices {
  Create(payload: ISaidasForm): Promise<ISaidasForm>
  Find(): Promise<ISaidas[]>
  FindByid(id: number): Promise<ISaidas>
  Update(payload: ISaidasForm, id: number): Promise<ISaidasForm>
  Delete(id: number): Promise<void>
}
