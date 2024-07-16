"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectInString = void 0;
var getObjectInString = function (object) {
    var objectReturn = "";
    try {
        objectReturn = JSON.stringify(object);
        return objectReturn;
    }
    catch (_a) { }
    return JSON.stringify({
        msg: "Unable to get return object",
    });
};
exports.getObjectInString = getObjectInString;
