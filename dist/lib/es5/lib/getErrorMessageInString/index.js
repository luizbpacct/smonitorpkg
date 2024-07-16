"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessageInString = void 0;
var getErrorMessageInString = function (error) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (error === null || error === void 0 ? void 0 : error.message)
        return error.message;
    if (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || ((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.details))
        return "".concat(((_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) || '', " - ").concat(((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.details) || '');
    if (typeof error === 'string')
        return error;
    return 'Unknown error';
};
exports.getErrorMessageInString = getErrorMessageInString;
