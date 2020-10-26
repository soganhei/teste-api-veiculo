# Documentação api

## Instalação 

> npm install

## Motoristas

> POST /veiculos `Criar um novo veículo`
***
> JSON envio
***
```
{
    "nome":"Marcus Antonio"
}
```

***
Status: 201

> JSON resposta
***

```
{
    "id":1234,
    "nome":"Marcus",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
``` 

> GET  /motoristas `Listar todos os motoristas`
***
Parametros para busca

> nome 

Status: 200

>JSON responsta
***
```
[
    {
        "id":1234,
        "nome":"Marcus",
        "dataCriacao": "2020-10-26T02:07:51.601Z"
    }
]
```

> GET /motoristas/:idMotorista `Listar um motorista pelo id`
***
Status: 200

JSON responsta
***
```
{
    "id:"1234,
    "nome":"Marcus",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
```

> PUT /motoristas/:idMotorista `Atualizar um motorista`

***
> JSON envio
***
```
{
    "id":1234,
    "nome":"Marcus Antonio"
}
```

***
Status: 200

> JSON resposta
***

```
{
    "id":1234,
    "nome":"Marcus Antonio",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
``` 

> DEL /motoristas/:idMotorista `Deletar um motorista`
***
Status: 204
 
***

## Veículos

> POST /veiculos `Criar um novo veículo`
***
> JSON envio
***
```
{
    "placa":"XXXX-XXXX",
    "marca":"BMW",
    "cor":"Azul"
}
```

***
Status: 201

> JSON resposta
***

```
{
    "id":1234,
    "placa":"XXXX-XXXX",
    "marca":"BMW",
    "cor":"Azul",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
``` 

> GET  /veiculos `Listar todos os veiculos`
***
Parametros para busca

> placa

> marca

> cor


Status: 200

>JSON responsta
***
```
[
    {
        "id":1234,
        "placa":"XXXX-XXXX",
        "marca":"BMW",
        "cor":"Azul",
        "dataCriacao": "2020-10-26T02:07:51.601Z"
    }
]
```

> GET /veiculos/:idVeiculo `Listar um veículo pelo id`
***
Status: 200

JSON responsta
***
```
{
    "id":1234,
    "placa":"XXXX-XXXX",
    "marca":"BMW",
    "cor":"Azul",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
```

> PUT /veiculos/:idVeiculo `Atualizar um veículo`

***
> JSON envio
***
```
{
    "id":1234,
    "placa":"XXXX-AAAA",
    "marca":"BMW",
    "cor":"Azul",
}
```

***
Status: 200

> JSON resposta
***

```
{
    "id":1234,
    "placa":"XXXX-AAAA",
    "marca":"BMW",
    "cor":"Azul",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
``` 

> DEL /veiculos/:idVeiculo `Deletar um veículo`
***
Status: 204 
***

## Saída de Veículo
> POST /saidas `Criar um nova saída`
***
> JSON envio
***
```
{
    "idMotorista":12346,
    "idVeiculo": 12347,
    "motivoSaida": "Viagem para SP"
}
```

***
Status: 201

> JSON resposta
***

```
{
    "id":1234,
    "idMotorista":12346,
    "idVeiculo": 12347,
    "motivoSaida": "Viagem para SP",
    "dataSaida": "2020-10-26",
    "dataEntrada": "",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
``` 

> GET  /saidas `Listar todos as saídas`
***
 
Status: 200

>JSON responsta
***
```
[
    {
        "id":1234,
        "idMotorista":12346,
        "idVeiculo": 12347,
        "motivoSaida": "Viagem para SP",
        "dataSaida": "2020-10-26",
        "dataEntrada": "",
        "dataCriacao": ,
        "motorista":{
            "id":12346,
            "nome":"Marcus Antonio",
            "dataCriacao": "2020-10-26T02:07:51.601Z"
        },
        "veiculo":{
            "id":12347,
            "placa":"XXXX-AAAA",
            "marca":"BMW",
            "cor":"Azul",
            "dataCriacao": "2020-10-26T02:07:51.601Z"
        }
    }
]
```
> GET /saidas/:idSaida `Listar um saída pelo id`
***
Status: 200

JSON responsta
***
```
{
        "id":1234,
        "idMotorista":12346,
        "idVeiculo": 12347,
        "motivoSaida": "Viagem para SP",
        "dataSaida": "2020-10-26",
        "dataEntrada": "",
        "dataCriacao": ,
        "motorista":{
            "id":12346,
            "nome":"Marcus Antonio",
            "dataCriacao": "2020-10-26T02:07:51.601Z"
        },
        "veiculo":{
            "id":12347,
            "placa":"XXXX-AAAA",
            "marca":"BMW",
            "cor":"Azul",
            "dataCriacao": "2020-10-26T02:07:51.601Z"
        }
    }
```

> PUT /saidas/:idSaida `Atualizar um saída`

***
> JSON envio
***
```
{
    "id":1234,
    "dataEntrada":"2020-10-27" 
}
```

***
Status: 200

> JSON resposta
***

```
{
    "id":1234,
    "idMotorista":12346,
    "idVeiculo": 12347,
    "motivoSaida": "Viagem para SP",
    "dataSaida": "2020-10-26",
    "dataEntrada": "2020-10-27",
    "dataCriacao": "2020-10-26T02:07:51.601Z"
}
```