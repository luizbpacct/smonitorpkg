import { getErrorMessageInString } from "../getErrorMessageInString";
import { getObjectInString } from "../getObjectInString";

type ServiceMonitorClassProps<RouteName> = {
  routeName?: RouteName;
};

type Context = {
  clients: {
    masterdata: {
      createDocument: (props: any) => any;
      searchDocumentsWithPaginationInfo: (props: any) => any;
    };
  };
};

type GetPerformanceObjectProps = {
  isError?: boolean;
  msg?: Record<any, any> | Array<any> | string;
  returnObject?: Record<any, any> | Array<any> | null;
  requestObject?: Record<any, any> | Array<any> | null;
  authType?: string[]
};

type PerformanceObject<RouteName> = {
  date: string;
  isError: boolean;
  msg: string;
  returnObject: string;
  requestObject: string;
  processingTime: number;
  routeName: RouteName;
  authType: string
};

type SaveDataProps<RouteName> = {
  data: PerformanceObject<RouteName>;
  ctx: Context;
  entity: string;
  minLatency?: number
};

type GetDataProps = {
  data: {
    startDate: string;
    endDate: string;
    pagination?: {
      page: number;
      pageSize: number;
    };
    routes: string[];
    sort?: string
  };
  ctx: Context;
  entity: string;
};

export class ServiceMonitorClass<RouteName = string> {
  private routeName?: RouteName;
  private date: string;
  private startTime: number | null;

  constructor(props?: ServiceMonitorClassProps<RouteName>) {
    this.date = new Date().toISOString();
    this.routeName = props?.routeName;
    this.startTime = null;
  }

  public startTimer() {
    if (!this.routeName) {
      throw new Error(" The routename has not been specified");
    }

    this.startTime = Date.now();
  }

  public getObject({
    isError = false,
    authType = [],
    msg = "Success",
    returnObject = null,
    requestObject = null,
  }: GetPerformanceObjectProps): PerformanceObject<RouteName> {
    if (this.startTime === null) {
      throw new Error("The timer has not started");
    }

    if (!this.routeName) {
      throw new Error(" The routename has not been specified");
    }

    const authFormated = JSON.stringify(authType)

    return {
      date: this.date,
      routeName: this.routeName,
      authType: authFormated,
      isError,
      msg: getErrorMessageInString(msg),
      returnObject:
        returnObject === null ? "null" : getObjectInString(returnObject),
      requestObject:
        requestObject === null ? "null" : getObjectInString(requestObject),
      processingTime: Date.now() - this.startTime,
    };
  }

  public saveData({ data, ctx, entity, minLatency = 1}: SaveDataProps<RouteName>) {

    if(minLatency > data.processingTime) return

    ctx.clients.masterdata.createDocument({
      dataEntity: entity,
      fields: data,
    });
  }

  public async getData({
    data: { startDate, endDate, pagination, routes, sort },
    ctx,
    entity,
  }: GetDataProps) {
    if (!startDate || !endDate) {
      throw new Error(`Invalid startDate or endDate`);
    }

    if (!ctx) {
      throw new Error("The ctx has not been informed");
    }

    let where = `date between ${startDate} AND ${endDate}`;

    if (routes?.length) {
      let addString = "";

      routes.forEach((route, index) => {
        addString += `routeName="${route}"`;
        if (routes.length !== index + 1) {
          addString += ` OR `;
        }
      });
      where = `${where} AND (${addString})`;
    }

    let params = {
      dataEntity: entity,
      fields: [
        "date",
        "isError",
        "msg",
        "returnObject",
        "requestObject",
        "processingTime",
        "routeName",
        "authType",
      ],
      pagination: {
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || 100,
      },
      where
    }

    if (sort) params['sort'] = sort

    return ctx.clients.masterdata.searchDocumentsWithPaginationInfo(params);
  }
}
