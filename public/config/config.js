
var global = global || {};

global.uip = {
	appid: "h5",
	key: "innjia2016111703",
	// url:"http://uip.innjia.com/api/InnjiaUip",
	// url:"http://testuip.innjia.com/test/api/InnjiaUip",

	// æ­£å¼æœ
	// url:"http://139.196.38.189:8040/uip/h5post",

	// æµ‹è¯•æœ
	url:"http://139.196.38.189:8041/testuip/h5post",

	// é¢„ç”Ÿäº§æœ
	// url:"http://139.196.38.189:8041/preuip/h5post",

	// photoUrl:"http://rent.innjia.com/innjia-service/innjiaH5/service/uploadFileSave.json",
	// photoUrl:"http://121.40.186.53:8080/innjia-service/innjiaH5/service/uploadFileSave.json",
    // photoUrl:"http://121.40.178.164:7171/settlement-center-service/api/index/saveImage.json",

    photoUrl:"http://yftest.innjia.com/innjia-service/api/upload/saveImage.json",//test
    // photoUrl:"http://121.40.178.164:8080/innjia-service/api/upload/saveImage.json",//test
    // photoUrl:"http://yfproduct.innjia.com/innjia-service/api/upload/saveImage.json",//pre
    // photoUrl:"http://121.40.201.35:8080/innjia-service/api/upload/saveImage.json",//pre
	// photoUrl:"http://rent.innjia.com/innjia-service/api/upload/saveImage.json",//zhengshi

	// photoUrl:"http://reed1991.eicp.net:16236/settlement-center-service/api/index/saveImage.json",

	// preAddressOld:"http://res.innjia.com/",
    // preAddress: "http://121.40.178.164:7171/"

    preAddress: "http://yftest.innjia.com"//test
    // preAddress: "http://121.40.178.164:8080"//test
    // preAddress: "http://yfproduct.innjia.com"//pre
    // preAddress: "http://121.40.201.35:8080"//pre
	// preAddress: "http://res.innjia.com"//zhengshi

	// preAddress: "http://reed1991.eicp.net:16235/"
};

global.rent = {
	// 正式服
	// url: "http://rent.innjia.com/innjia-h5/api/route/loading.html"

	// 测试服
	url: "http://121.40.178.164:8080/innjia-h5/api/route/loading.html"

	// 预生产服
	// url: "http://121.40.201.35:8080/innjia-h5/api/route/loading.html"
}

// java接口
global.process = {
    dev: false, // 开发模式 ---
    test: true, // 测试模式
    prod: false // 生产模式
}
if (global.process.dev) {
    // ==================== 本地开发

    /* ---------------------- update by wuchenyu  2016-10-04  begin -----------*/
    global.host = "http://192.168.1.82:8080/innjia-service";
    // global.resource = "http://121.40.178.164:8080/";
    // global.pay = "http://121.40.201.35:7070/paycenter-service"; // 支付
    /* ---------------------- end ----------------------  */

    //global.host = "http://121.40.178.164:8080/innjia-service";
    //global.resource = "http://121.40.178.164:8080/";
    //global.pay = "http://121.40.201.35:7070/paycenter-service"; // 支付

    //global.host = "http://121.40.201.35:8080/innjia-service"; // 外部测试服
    global.pay = "http://121.40.201.35:7070/paycenter-service"; // 支付
    global.resource = "http://114.55.229.66:8080/"; // 上传图片资源
    global.payrentInnjia = "http://wx.innjia.com/h5v2/test/pay-rent/#/";
    /**
     * checkstand 支付页面showUrl回调前缀。
     * @type {String}
     */
    global.showUrlHost = "http://121.40.201.35:8080/";

}
if (global.process.test) {
    // ==================== 测试环境
    //global.host = "http://114.55.234.160:8080/innjia-service"; // 外部测试服
    //global.resource = "http://114.55.234.160:8080/";     // 上传图片资源
    //
    global.host = "http://121.40.178.164:8080/innjia-service"; // 外部测试服
    global.pay = "http://121.40.178.164:7070/paycenter-service"; // 支付
    global.resource = "http://121.40.178.164:8080/"; // 上传图片资源
    /**
     * checkstand 支付页面showUrl回调前缀。
     * @type {String}
     */
    global.payrentInnjia = "http://wx.innjia.com/h5v2/test/pay-rent/#/";
    global.showUrlHost = "http://121.40.178.164:8080/";
}
if (global.process.prod) {
    // ==================== 生产正式
    global.host = "http://rent.innjia.com/innjia-service"; // 外部测试服
    global.pay = "http://pay.innjia.com/paycenter-service"; // 支付
    global.resource = "http://res.innjia.com/"; // 上传图片资源
    global.payrentInnjia = "http://wx.innjia.com/h5v2/pay-rent/#/"; // 盈家付房租H5页面
    /**
     * checkstand 支付页面showUrl回调前缀。
     * @type {String}
     */
    global.showUrlHost = "http://rent.innjia.com/";
}
