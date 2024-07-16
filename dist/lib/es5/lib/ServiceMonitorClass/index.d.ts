type ServiceMonitorClassProps<RouteName> = {
    routeName?: RouteName;
};
type Context = {
    clients: {
        masterdata: {
            createDocument: (props: any) => any;
        };
    };
};
type GetPerformanceObjectProps = {
    isError?: boolean;
    msg?: Record<any, any> | Array<any> | string;
    returnObject?: Record<any, any> | Array<any>;
    requestObject?: Record<any, any> | Array<any>;
};
type PerformanceObject<RouteName> = {
    date: string;
    isError: boolean;
    msg: string;
    returnObject: string;
    requestObject: string;
    processingTime: number;
    routeName: RouteName;
};
type SaveDataProps<RouteName> = {
    data: PerformanceObject<RouteName>;
    ctx: Context;
    entity: string;
};
export declare class ServiceMonitorClass<RouteName = string> {
    private routeName?;
    private date;
    private startTime;
    constructor(props?: ServiceMonitorClassProps<RouteName>);
    startTimer(): void;
    getObject({ isError, msg, returnObject, requestObject }: GetPerformanceObjectProps): PerformanceObject<RouteName>;
    saveData({ data, ctx, entity }: SaveDataProps<RouteName>): void;
}
export {};
