export var getObjectInString = function (object) {
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
