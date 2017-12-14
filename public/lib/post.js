var postdata = function(methodId, params) {

    return {
            "methodId": methodId,
            "data": JSON.stringify(params),
            "useragent": navigator.userAgent,
            "mobile": (getArgs().mobile || "")
    };

}