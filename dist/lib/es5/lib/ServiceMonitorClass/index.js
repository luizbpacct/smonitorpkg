"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMonitorClass = void 0;
var getErrorMessageInString_1 = require("../getErrorMessageInString");
var getObjectInString_1 = require("../getObjectInString");
var ServiceMonitorClass = /** @class */ (function () {
    function ServiceMonitorClass(props) {
        this.date = new Date().toISOString();
        this.routeName = props === null || props === void 0 ? void 0 : props.routeName;
        this.startTime = null;
    }
    ServiceMonitorClass.prototype.startTimer = function () {
        if (!this.routeName) {
            throw new Error(' The routename has not been specified');
        }
        this.startTime = Date.now();
    };
    ServiceMonitorClass.prototype.getObject = function (_a) {
        var _b = _a.isError, isError = _b === void 0 ? false : _b, _c = _a.msg, msg = _c === void 0 ? 'Success' : _c, _d = _a.returnObject, returnObject = _d === void 0 ? null : _d, _e = _a.requestObject, requestObject = _e === void 0 ? null : _e;
        if (this.startTime === null) {
            throw new Error('The timer has not started');
        }
        if (!this.routeName) {
            throw new Error(' The routename has not been specified');
        }
        return {
            date: this.date,
            routeName: this.routeName,
            isError: isError,
            msg: (0, getErrorMessageInString_1.getErrorMessageInString)(msg),
            returnObject: (0, getObjectInString_1.getObjectInString)(returnObject),
            requestObject: (0, getObjectInString_1.getObjectInString)(requestObject),
            processingTime: Date.now() - this.startTime,
        };
    };
    ServiceMonitorClass.prototype.saveData = function (_a) {
        var data = _a.data, ctx = _a.ctx, entity = _a.entity;
        ctx.clients.masterdata.createDocument({
            dataEntity: entity,
            fields: data,
        });
    };
    return ServiceMonitorClass;
}());
exports.ServiceMonitorClass = ServiceMonitorClass;
