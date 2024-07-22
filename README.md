<div align="center">
  <img width="100px" src="./public/assets/icon.png" style="max-width: 100px;" alt="Print: Valor do serviço Takeback"/>
</div>

<div align="center">
  <h1>Service Monitor Package</h1>
</div>

O **Service Monitor Package** é um pacote que foi desenvolvido para utilizar em conjunto com o app [Service Monitor](https://github.com/luizbpacct/service-monitor-admin-app) onde é utilizado no código dos serviços que populam a base de dados de logs para a analise do app.

## Pré-requisitos

### Para implementar o pacote no código, é necessário primeiro:

#### 1º - Entidade de dados
Ter uma entidade criada no Masterdata conforme foi mostrado na [DOC do Service monitor](https://github.com/luizbpacct/service-monitor-admin-app?tab=readme-ov-file#para-que-a-ferramenta-funcione-%C3%A9-necess%C3%A1rio)

#### 2º - Serviço da VTEX
É necessário ter um [Serviço VTEX](https://developers.vtex.com/docs/guides/vtex-io-documentation-service) criado (ou em construção).

## 🚀 Instalando

Para instalar o pacote em seu projeto basta executar o seguinte comando:

```bash
# Se for NPM
$ npm i @lcbp/smonitorpkg

# Se for Yarn
$ yarn add @lcbp/smonitorpkg
```

## ☕ Como utilizar
A biblioteca disponibiliza algumas funções porém a principal delas é a `ServiceMonitorClass` que gera uma classe que faz todo o processo de registro dos logs da rota.

### ServiceMonitorClass
Como dito acima, essa classe tem como objetivo gerar um objeto de monitoramento na rota, que ao finalizar ou ocorrer um erro no tempo de vida da requisição, ele registra:
 - Nome da rota
 - Data e hora do registro
 - Tempo de processamento em milissegundos
 - Status da requisição se foi de erro ou não
 - O Objeto que foi enviado para a requisição
 - O Objeto de resposta da requisição
 - Mensagem, caso haja

#### Implementando
Vá até ao controller da sua rota, ou a função onde você deseja registrar o log e que também tenha todos os processos daquela requisição, visto que vamos calcular através dessa classe o tempo de processamento da rota no tempo de vida da requisição.

1. Primeiro importe o pacote no arquivo do controller
 ```javascript
 import { ServiceMonitorClass } from '@lcbp/smonitorpkg'
 ```

2. Agora no inicio da função do controller adicione o seguinte código:
 
 ```javascript
 const performanceObject = new ServiceMonitorClass({
    routeName: '{{NOME_DA_ROTA}}', // Substitua pelo nome da rota em questão
  })
  performanceObject.startTimer()
 ```
Esse processo ira iniciar o objeto de monitoramento, dando um start no "timer" interno.

3. Agora em cada ponto que finaliza a "jornada" da requisição (como um erro, ou o retorno da requisição) adicione o seguinte código:
 ```javascript
ctx.clients.events.sendEvent('', '{{NOME_DO_EVENTO}}',
    performanceObject.getObject({
        isError: false, // Se o código deu erro essa várivel sera `true`
        
        msg: '', // Mensagem de retorno, caso haja
        
        requestObject: {}, // Objeto que foi enviado pelo usuário no body e caso tenha sido na query monte um objeto com as váriveis enviadas

        returnObject: {}, // Objeto que foi retornado na requisição
    })
)
 ```
Como você já deve ter percebido utilizamos o `sendEvents` para enviar nosso objeto de monitoramento, mais a frente será explicado como configurar esse evento no seu serviço da VTEX.

Pronto agora a sua rota já esta pronta para enviar os dados de monitoramento.






## Ícones utilizados
- <a href="https://www.flaticon.com/free-icons/server" title="server icons">Server icons created by RaftelDesign - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Maxim Basinski Premium - Flaticon</a>
![alt text](image.png)
- <a href="https://www.flaticon.com/free-icons/box" title="box icons">Box icons created by Freepik - Flaticon</a>
