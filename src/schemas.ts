export interface IMotoristas {
  id: number
  key: string
  nome: string
  dataCriacao: string
}

export interface IVeiculos {
  id: number
  key: string
  cor: string
  marca: string
  placa: string
  dataCriacao: string
}

export interface ISaidas {
  id: number
  dataSaida: string
  idVeiculo: number
  veiculo: IVeiculos
  dataCriacao: string
  idMotorista: number
  motivoSaida?: string
  dataEntrada?: string
  motorista: IMotoristas
}

export interface ISaidasForm {
  id: number
  key: string
  dataCriacao: string
  dataSaida: string
  idVeiculo: number
  idMotorista: number
  dataEntrada: string
  motivoSaida: string
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
