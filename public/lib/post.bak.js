var postdata = function(methodId, params) {

        var md5 = new SparkMD5();
        
        // 对象键值排序
    	function orderObj(obj) {
    		var o = {};
    		Object.keys(obj).forEach((key) => {
    			o[key] = obj[key];
    		});
    		return o;
    	};
    	
        // 对象按`name1=value1&name2=value2`序列化
    	function param(obj) {
    		var arr = [];
    		for (var i in obj) {
    			arr.push(i + '=' + obj[i]);
    		}
    		return arr.join('&');
    	};

    var result = {
        appid: global.uip.appid,
        methodId: methodId + "",
        methodParam: JSON.stringify(params),
        nonce: Math.random().toString(),
        timestamp: new Date().getTime().toString()
    }
    // MD5字符串参数
	var str = decodeURIComponent(param(orderObj(result)));
	str += '&key=' + global.uip.key;
    var hash = md5.hash(str).toUpperCase();
    result.signature = hash;
    return result;
}