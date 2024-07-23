<div align="center">
  <img width="100px" src="./public/assets/icon.png" style="max-width: 100px;" alt="Print: Valor do serviço Takeback"/>
</div>


<div align="center">
  <h1>Service Monitor Package</h1>
</div>


O **Service Monitor Package** é um pacote que foi desenvolvido para utilizar em conjunto com o app [Service Monitor](https://github.com/luizbpacct/service-monitor-admin-app) onde é utilizado no código dos serviços que populam a base de dados de logs para a analise do app.


## Pré-requisitos
Para implementar o pacote no código, é necessário primeiro:


**1º** Entidade de dados:<br>
Ter uma entidade criada no Masterdata conforme foi mostrado na [DOC do Service monitor](https://github.com/luizbpacct/service-monitor-admin-app?tab=readme-ov-file#para-que-a-ferramenta-funcione-%C3%A9-necess%C3%A1rio)


**2º** Serviço da VTEX:<br>
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
A biblioteca disponibiliza algumas funções, porém a principal delas é a `ServiceMonitorClass` que gera uma classe que faz todo o processo de registro dos logs da rota.


### ServiceMonitorClass


| Prop        | Tipo   | Padrão       | Descrição    |
|-------------|--------|--------------|--------------|
| routeName   | string | -            | Nome da rota |


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


**1º** Primeiro importe o pacote no arquivo do controller
 ```javascript
 import { ServiceMonitorClass } from '@lcbp/smonitorpkg'
 ```


**2º** Agora no inicio da função do controller adicione o seguinte código:
```javascript
const performanceObject = new ServiceMonitorClass({
    routeName: '{{NOME_DA_ROTA}}', // Substitua pelo nome da rota em questão
  })
  performanceObject.startTimer()
```
Esse processo irá iniciar o objeto de monitoramento, dando um start no "timer" interno.


**3º** Agora em cada ponto que finaliza a "jornada" da requisição (como um erro, ou o retorno da requisição) adicione o seguinte código:
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
Como você já deve ter percebido, utilizamos o `sendEvents` para enviar nosso objeto de monitoramento, mas no próximo passo será explicado como configurar esse evento no seu serviço da VTEX.
Pronto agora a sua rota já está pronta para enviar os dados de monitoramento.


**4º** Agora vamos criar o evento que salva esses objetos de monitoramento dentro do master data, para isso entre no arquivo `node/service.json` e adicione esse objeto:
```json
{
  ...
  "events": {
    "savePerformanceLog": {
      "sender": "{{CONTA}}.{{NOME_DO_APP}}",
      "keys": ["send-performance-log"]
    }
  },
}
```
e substitua as variáveis para o seu cenário, nesse caso o nome do App é o nome do seu app de serviço que está no arquivo `./manifest.json`.


Agora crie uma pasta dentro da pasta `node` do seu serviço com o nome de `events` e dentro dela crie uma arquivo com o nome `savePerformanceLog.ts`.
Acesse esse arquivo e cole o código abaixo:
```javascript
import { ServiceMonitorClass } from '@lcbp/smonitorpkg'
import { EventContext, IOClients } from '@vtex/api'


export async function savePerformanceLog(ctx: EventContext<IOClients>) {
  try {
    const performanceObject = new ServiceMonitorClass()


    performanceObject.saveData({
      ctx,
      data: {
        ...ctx.body,
      },
      entity: '{{ENTIDADE_DO_MASTERDATA}}', // Aqui, coloque o acronyum da entidade do masterdata que você criou para registrar os dados dessa API
    })
  } catch (error) {
    console.error(error)
  }
```
Esse código é responsável por pegar os dados que foram enviados no passo anterior e salvar corretamente na entidade de dados do MasterData.
> É possível também criar uma configuração no settingsSchema para deixar essa entidade dinâmica, ou seja, caso seu app seja usado em mais de uma account, você consegue configurar dinamicamente pelas configurações do App para qual entidade os dados serão salvos.




Agora para finalizar acesse o arquivo `node/index.ts` e adicione a Classe de Serviço o objeto `events`:


```javascript
export default new Service({
  clients,
  routes: {
    ...
  },
  events: {
    savePerformanceLog: savePerformanceLog,
  },
})
```
Isso irá adicionar esse evento ao seu app permitindo escutar o disparo do evento feito no passo anterior.




### getErrorMessageInString


| Prop  | Tipo                       | Padrão | Descrição                                                                     |
|-------|----------------------------|--------|-------------------------------------------------------------------------------|
| error | (Object, Array ou String) | -      | Objeto do erro, o objeto que o catch retorna ou um objeto montado manualmente |


Essa função retornar a mensagem que contém dentro de um objeto de erro, que geralmente segue o seguinte padrão:
- Se o objeto passado for do tipo string ele retorna ele mesmo
- error?.message
- error?.response?.data?.error
- error?.response?.data?.details
- E caso não encontre em nenhum dos casos acima retorna por default `Unknown error`


### getObjectInString


| Prop  | Tipo               | Padrão | Descrição                        |
|-------|--------------------|--------|----------------------------------|
| error | (Onbject ou Array) | -      | O objeto que será "stringficado" |


Essa função tenta executar o comando `JSON.stringify` no objeto, caso não consiga por conta do tamanho do objeto, ele retorna um objeto padrão "stringficado":
```json
{
  "msg": "Unable to get return object",
}
```


## Ícones utilizados
- <a href="https://www.flaticon.com/free-icons/server" title="server icons">Server icons created by RaftelDesign - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Maxim Basinski Premium - Flaticon</a>
![alt text](image.png)
- <a href="https://www.flaticon.com/free-icons/box" title="box icons">Box icons created by Freepik - Flaticon</a>



