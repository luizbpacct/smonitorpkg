import { getErrorMessageInString } from "../getErrorMessageInString"
import { getObjectInString } from "../getObjectInString"

type ServiceMonitorClassProps<RouteName> = {
  routeName?: RouteName
}

type Context = {
  clients: {
    masterdata: {
      createDocument: (props: any) => any
    }
  }
}

type GetPerformanceObjectProps = {
  isError?: boolean
  msg?: Record<any, any> | Array<any> | string
  returnObject?: Record<any, any> | Array<any>
  requestObject?: Record<any, any> | Array<any>
}

type PerformanceObject<RouteName> = {
  date: string
  isError: boolean
  msg: string
  returnObject: string
  requestObject: string
  processingTime: number
  routeName: RouteName
}

type SaveDataProps<RouteName> = {
  data: PerformanceObject<RouteName>
  ctx: Context
  entity: string
}

export class ServiceMonitorClass<RouteName = string> {
  private routeName?: RouteName
  private date: string
  private startTime: number | null
  
  constructor(props?:ServiceMonitorClassProps<RouteName>) {
    this.date = new Date().toISOString()
    this.routeName = props?.routeName
    this.startTime = null
  }

  public startTimer() {
    if (!this.routeName) {
      throw new Error(' The routename has not been specified')
    }

    this.startTime = Date.now()
  }

  public getObject({
    isError = false,
    msg = 'Success',
    returnObject = null,
    requestObject = null
  }: GetPerformanceObjectProps): PerformanceObject<RouteName> {
    if (this.startTime === null) {
      throw new Error('The timer has not started')
    }

    if (!this.routeName) {
      throw new Error(' The routename has not been specified')
    }

    return {
      date: this.date,
      routeName: this.routeName,
      isError,
      msg: getErrorMessageInString(msg),
      returnObject: getObjectInString(returnObject),
      requestObject: getObjectInString(requestObject),
      processingTime: Date.now() - this.startTime,
    }
  }

  public saveData({data, ctx, entity}: SaveDataProps<RouteName>) {
    ctx.clients.masterdata.createDocument({
      dataEntity: entity,
      fields: data,
    })
  }
}
