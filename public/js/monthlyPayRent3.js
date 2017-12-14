var historyRec;
var contract;
var isOpenAgreement = 0;

(function () {
    // debugger
    if (!getArgs().mobile) {
        $('.weui_toast_content').text("入口参数缺少[mobile]");
        return false;
    }

    if (!getArgs().loginStatus) {
        $('.weui_toast_content').text("入口参数缺少[loginStatus]");
        return false;
    }

    if (!getArgs().openId && !getArgs().userId) {
        $('.weui_toast_content').text("入口参数缺少[openId]");
        return false;
    }

    ( function(){
        //根据是否有历史租约 控制图标的显示与隐藏
        var methodId = "4031";
        var methodParam = {};
        methodParam.openId = getArgs().openId;
        var info = postdata(methodId,methodParam);

        $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            success: function(jsonData) {
                console.log("4031",jsonData);
                var data = jsonData.res.data;
                if( data && data.rows && data.rows.length == 0 ) {
                    $('.history-icon').hide();
                } else {
                    $('.history-icon').show();
                }
            }
        });
    } )();

    //点击查看历史
    $('.history').on('click', function () {
        window.location.href = "payHistoryList.html?openId="+(getArgs().openId || getArgs().userId);
    });

    var methodId = "J016";
    var methodParam = {"mobile": getArgs().mobile};

    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            // debugger
            if (jsonData) {
                // 1.isExist ：是否存在还款中订单，0为不存在，1为存在
                // 2.isExistOverdue ：还款计划是否逾期，0为未逾期，1为逾期
                // 3.warnStatus ：是否需要提醒，0为不需要，1为需要
                // 4.day ：逾期天数
                if ("0" == jsonData.code && "1" == jsonData.res.data.isExist) {
                    window.location.href = global.rent.url + "?mobile="+getArgs().mobile+"&loginStatus="+getArgs().loginStatus;
                } else {
                    getUserInfo_1026();
                }
            }
        },
        error: function (a, b, c) {
            console.log(a);
        }
    });

}).call(this);

var getUserInfo_1026 = function() {
    var methodId = "1026";
    var methodParam = {originalId: (getArgs().openId || getArgs().userId)};

    var info = postdata(methodId,methodParam);

     $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            debugger
            if (jsonData && jsonData.code && jsonData.res && jsonData.res.data) {
                // code == 419 表示没有还款计划： 您当前没有房屋租约哦
                if ("419" == jsonData.code) {
                    location.href = "noContract.html?tip=tip2&openId="+getArgs().openId;
                }

                // code == 418 表示没有生效的合同： 您的房屋租约还没有确认哦
                if ("418" == jsonData.code) {
                    location.href = "noContract.html?tip=tip1&openId="+getArgs().openId;
                }

                // code == 0 表示有合同，可以支付
                if ("0" == jsonData.code || "420" == jsonData.code || "421" == jsonData.code) {

                    // code == 420 表示租客已完善资料并已确认，但资方尚未放款
                    if ("420" == jsonData.code) {
                        pay_button({ disable: true });

                    // code == 421 表示租客已支付本期，但下期支付时间未到
                    } else if ("421" == jsonData.code) {
                        pay_button({ ucantpaynow: true });
                        $('.pay-tip').hide();
                        $('.overdue-cost').hide();

                    // 正常支付
                    } else {
                        pay_button({ disable: false });
                    }

                    $('.weui_loading_toast').hide();
                    $('.history-title, .history-list, .pay-info').show();

                    var data = jsonData.res.data;
                    contract = jsonData.res.data;
                    if (!contract.lastNeedPay && contract.firstPlan) {
                        data.lastNeedPay = contract.firstPlan;
                        contract.lastNeedPay = contract.firstPlan;
                    }

                    var lastNeedPay = data.lastNeedPay;
                    if (lastNeedPay) {
                        var overdueDays = Number(lastNeedPay.overdueDays || 0);
                        if(isNaN(overdueDays) || overdueDays === 0){
                            $(".overdue").hide();
                            $("div[name=overdueTip]").hide();
                            $('.overdue-cost').hide();
                        }
                        else{
                            $("span[name=overdueDays]").html(lastNeedPay.overdueDays);
                        }

                        $("span[name=planRepaymentDate]").html(lastNeedPay.planRepaymentDate.split(" ")[0]);
                        $("span[name=planRepaymentAmount]").html( (lastNeedPay.planRepaymentAmount+lastNeedPay.overdueFee) );
                        $("span[name=overdueFee]").html(lastNeedPay.overdueFee);

                    } else {
                    }

                    // 2017.3.16 小艳要求去掉交租总期数，只要看到当前几期
                    // $('span[name=totalPeriodNum]').text(data.totalPeriodNum || 23);

                    //判断是否在4.2.3及以上版本打开
                    // $('.qweqweqwe').html( isNewAppOpen() );
                    // isNewAppOpen();
                    if( isNewAppOpen() ) {
                        //只显示 立即支付 按钮
                        $(".payment-btn").show();
                        $(".disable-btn.clearfix").hide();

                        if(data.isCanPay === 1){
                            $(".payment-button.canpay").show();
                            $(".disable-button").hide();
                        }
                        else{
                            $(".payment-button.canpay").hide();
                            $(".disable-button").show();
                        }

                        //已开通代扣提示 隐藏
                        if(data.isOpenAgreement === 0){
                            $(".payment-tip-wrapper").hide();
                        }

                    } else {//4.2.2及以下版本
                        //已开通代扣
                        isOpenAgreement = data.isOpenAgreement;
                        if(data.isOpenAgreement === 1){
                            $(".payment-btn").show();
                            $(".disable-btn.clearfix").hide();

                            if(data.isCanPay === 1){
                                $(".payment-button.canpay").show();
                                $(".disable-button").hide();
                            }
                            else{
                                $(".payment-button.canpay").hide();
                                $(".disable-button").show();
                            }
                        }
                        else{
                            $(".payment-btn").hide();
                            $(".disable-btn.clearfix").show();
                            $(".payment-tip-wrapper").hide();

                            if ("420" == jsonData.code || "421" == jsonData.code) {
                                // 若420或410，则不需要判断isCanPay
                            } else {
                                 if(data.isCanPay === 0){
                                    $(".paybtn.disable-button").show();
                                    $(".paybtn.payment-button").hide();
                                 }
                                 else{
                                    $(".paybtn.disable-button").hide();
                                    $(".paybtn.payment-button").show();
                                 }

                            }
                        }
                    }


                    $('span[name=paidPeriod]').text(data.payHistory.length);

                    var payHistory = data.payHistory;
                    if($.isArray(payHistory)
                       && payHistory.length > 0){
                       $.each(payHistory, function(i, j){
                            // var $li = $("<li><span class=\"left\">" + (j.periodNum+1) + "</span><span class=\"center\">" + j.planRepaymentDate.split(" ")[0] + "</span><span class=\"right\">" + j.realRepaymentAmount + "</span></li>");
                            //var $li = $("<li><span class=\"left\">" + (j.periodNum+1) + "</span><span class=\"center\">" + j.repaymentDate.split(" ")[0] + "</span><span class=\"right\">" + j.realRepaymentAmount + "</span></li>");
                            var $li = $("<li><span class=\"left\">" + (j.periodNum+1) + "</span><span class=\"real-pay-date\">" + getRepaymentDate( j.repaymentDate,j.planRepaymentDate,j.planStatus ) + "</span><span class=\"pay-deal-amount\">" + getRepayAmount( j.planRepaymentAmount,j.realRepaymentAmount,j.planStatus ) + "</span><span class=\"pay-stauts\">"+getPayStatus(j.planStatus)+"</span></li>");
                            $("ul[name=payHistory]").append($li);
                       });
                    }
                }

            } else {
                console.log("未获取到合同信息, 合同编号");
                location.href="unconfirmed.html";
            }
        }
    });
}

//获取 支付成功  或者  线下支付
function getPayStatus ( payStatus ) {
    if( payStatus == 1 ) {
        return "支付成功";
    } else if ( payStatus == 2 ) {
        return "线下支付";
    }
}

// 获取支付时间
function getRepaymentDate ( repaymentDate,planRepaymentDate,payStatus ) {
    if( repaymentDate ) {
        return repaymentDate.split(" ")[0];
    } else {
        if( payStatus == 1 ) {
            return repaymentDate.split(" ")[0];
            // return repaymentDate ? repaymentDate.split(" ")[0] : '';
        } else if ( payStatus == 2 ) {
            return planRepaymentDate.split(" ")[0];
            // return planRepaymentDate ? planRepaymentDate.split(" ")[0] : '';
        }
    }

}

// 获取支付金额
function getRepayAmount ( planRepaymentAmount,realRepaymentAmount,payStatus ) {
    if( payStatus == 1 ) {
        return realRepaymentAmount;
    } else if ( payStatus == 2 ) {
        return planRepaymentAmount;
    }
}


var zhifu_1025 = function (e) {

        // 1025
        //      params
        // contractId  guid    Y       合同号
        // openId  string  Y       租客的OpenID
        // payAmount   decimal Y       租金，如果有逾期费用，记得加上
        // rentDate    string  Y       支付的租期（yyyy-MM-dd）
        // cellPhone   string  Y       用户手机号
        // planId  string  Y       还款计划编号
        //      result
                    // "orderId": "b3d5fc346b584c9287729443ac1bb6af",
                    // "payId": "YJSH000018816640695b3d5fc346b584c9287729443ac1bb6af1702260239504",
                    // "totalFee": "2000"
        var date_yyyymmdd = contract.lastNeedPay.planRepaymentDate.split(" ")[0];

        var methodId = "1025";
        var methodParam = {
            // "contractId": contract.lastNeedPay.originalId,
            "contractId": contract.tenants.contractId,
            "openId": (getArgs().openId || getArgs().userId),
            "cellPhone": getArgs().mobile,
            "payAmount": ( contract.lastNeedPay.planRepaymentAmount+contract.lastNeedPay.overdueFee ),
            "rentDate": date_yyyymmdd,
            "planId": contract.lastNeedPay.repaymentPlanId
        };
        var info = postdata(methodId,methodParam);

         $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            timeout: 5000,
            success: function (jsonData) {
                if (jsonData && jsonData.code == "0" && jsonData.res && jsonData.res.data) {

                    var data = jsonData.res.data;
                // "body": "房租代扣"
                // "externalSignNo": ""
                // "orderId": "057c68d16f174c869b8de8e1d551c411"
                // "outTradeNo": "00000000-0000-0000-0000-000000000000"
                // "payId": "ZH000000182121256138057c68d16f174c869b8de8e1d551c41120170301151156"
                // "price": ""
                // "quantity": "1"
                // "returnUrl": ""
                // "showUrl": "商品展示网址"
                // "subject": "房租代扣"
                // "totalFee": "3000"

                // "projectNo":"YJSH",//项目编号
                // "outTradeNo":"YJSH000015202192158526ec4599a864ce48c5244609618f4131702230538181",//商户网站唯一订单号 String(64)
                // "subject":"测试",//商品标题
                // "totalFee":"25.00",//订单金额，number(9,2)
                // "quantity":"1",//商品数量，String(100)
                // "price":"25.00",// 商品单价，number(9,2)
                // "body":"测试描述",//订单描述，String(400)
                // "showUrl":"http://www.baidu.com",//商品展示网址，String(400)
                // "requestFromUrl":"ZUHOUSHENGHUO://callback",
                // "returnUrl":"http://www.baidu.com",//页面跳转同步通知页面路径，
                // "externalUserId":"",//商户网站用户标识 String 用户在商户网站的唯一标识，用于在签约页面展示。
                // "externalSignNo":"111",
                // "id":"526ec4599a864ce48c5244609618f413",
                // "contractNo":"测试合同号",
                // "userName":"测试名字",
                // "userAddress":"测试地址"

                // 接口并没有给 contract.house
                var userAddress = "";
                if (contract.house) {
                    userAddress = contract.house.areaName + contract.house.roomAddress + (contract.house.roomCode || "")
                }

                //////////////// 支付
                    var sendToApp = {
                        "projectNo": "ZG",
                        "subject": "月付",
                        "totalFee": data.totalFee,
                        "quantity": 1,
                        "price": data.totalFee,
                        "body": "每月一付",
                        "showUrl": "http://www.baidu.com",
                        "requestFromUrl": "ZUHOUSHENGHUO://callback",
                        "returnUrl": "http://www.baidu.com",
                        "returnType": "url",
                        "externalUserId": (getArgs().openId || getArgs().userId),
                        "externalSignNo": data.externalSignNo,
                        "id": data.orderId,
                        "isOpenAgreement": isOpenAgreement,
                        "contractNo": contract.contractNo,
                        "userName": contract.tenants.name,
                        "outTradeNo": data.payId,
                        "channel":"ALIPAYAPP",//接入渠道，用户接入渠道，取值范围： ALIPAYAPP：支付宝钱包 PC：PC端访问 WAP：WAP访问
                        "userAddress": userAddress,
                        "sceneAndParams": JSON.stringify( data.sceneAndParams )
                    };
                    console.log(sendToApp);
                    util.toZhiFu(sendToApp);

                } else {
                    console.log("申请创建交租订单失败:" + contract.contractId);
                }
            },
            complete:function() {
                $('.payment-button').removeClass('disabled').off('click').on("click",function() {
                    zhifu_1025(e);
                });
            }
        });
}


function pay_button(opt) {
    var opt = opt || {}, paybtns = $('.payment-button');
    if (opt.disable) {
        // 交不了租，不能点按钮
        $('.disable-button').addClass('disabled').text('账单激活中').off('click');
        // paybtns.addClass('disabled').text('账单激活中')
        // .off('click');
    } else if (opt.ucantpaynow) {
        // 未到交租时间
        paybtns.addClass('disabled').text('未到交租日')
        .off('click');
    } else {
        // 阔以交租，按钮能点
        paybtns.removeClass('disabled').text('立即支付')
        .on('click', function (e) {
            paybtns.addClass('disabled').off('click');
            zhifu_1025(e);
        });
    }
}



$(function () {
    $(".back-button").on('click', function (e) {
        location.href = "innjia-js://closeView";
    });

    $(".open-pay").on('click', function (e) {
    // 1027
    //      params
    // contractId  guid    Y       合同号
    // openId  string  Y       租客的openId
    // payAmount   string  Y       收款的月租租金
    // rentDate    string  Y       收款针对的租期(2017-02-10)
    // cellPhone   string  Y       租客手机号
    // planId  string  Y       还款计划编号
    //      result
    // "orderId": "b3d5fc346b584c9287729443ac1bb6af",
    // "payId": "YJSH000018816640695b3d5fc346b584c9287729443ac1bb6af1702260239504",
    // "totalFee": "2000"
    var date_yyyymmdd = contract.lastNeedPay.planRepaymentDate.split(" ")[0];

        var methodId = "1027";
        var methodParam = {
            "contractId": contract.tenants.contractId,
            "openId": (getArgs().openId || getArgs().userId),
            "cellPhone": getArgs().mobile,
            "payAmount": contract.lastNeedPay.planRepaymentAmount,
            "rentDate": date_yyyymmdd,
            "planId": contract.lastNeedPay.repaymentPlanId
        };
        console.log(methodParam);
        var info = postdata(methodId,methodParam);

         $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            success: function (jsonData) {
                if (jsonData && jsonData.code == "0" && jsonData.res && jsonData.res.data) {

                    var data = jsonData.res.data;
        // "body": "房租代扣"
        // "externalSignNo": ""
        // "orderId": "057c68d16f174c869b8de8e1d551c411"
        // "outTradeNo": "00000000-0000-0000-0000-000000000000"
        // "payId": "ZH000000182121256138057c68d16f174c869b8de8e1d551c41120170301151156"
        // "price": ""
        // "quantity": "1"
        // "returnUrl": ""
        // "showUrl": "商品展示网址"
        // "subject": "房租代扣"
        // "totalFee": "3000"

        // "projectNo":"YJSH",//项目编号
        // "outTradeNo":"YJSH000015202192158526ec4599a864ce48c5244609618f4131702230538181",//商户网站唯一订单号 String(64)
        // "subject":"测试",//商品标题
        // "totalFee":"25.00",//订单金额，number(9,2)
        // "quantity":"1",//商品数量，String(100)
        // "price":"25.00",// 商品单价，number(9,2)
        // "body":"测试描述",//订单描述，String(400)
        // "showUrl":"http://www.baidu.com",//商品展示网址，String(400)
        // "requestFromUrl":"ZUHOUSHENGHUO://callback",
        // "returnUrl":"http://www.baidu.com",//页面跳转同步通知页面路径，
        // "externalUserId":"",//商户网站用户标识 String 用户在商户网站的唯一标识，用于在签约页面展示。
        // "externalSignNo":"111",
        // "id":"526ec4599a864ce48c5244609618f413",
        // "contractNo":"测试合同号",
        // "userName":"测试名字",
        // "userAddress":"测试地址"

        // 接口并没有给 contract.house
        var userAddress = "";
        if (contract.house) {
            userAddress = contract.house.areaName + contract.house.roomAddress + (contract.house.roomCode || "")
        }

        //////////////// 代扣
                    var sendToApp = {
                        "projectNo": "ZG",
                        "projectId": "ZG",//项目编号
                        "outTradeNo": data.externalSignNo,
                        "subject": "月付",
                        "totalFee": data.totalFee,
                        "quantity": 1,
                        "price": data.totalFee,
                        "body": "每月一付",
                        "showUrl": "http://www.baidu.com",
                        "requestFromUrl": "ZUHOUSHENGHUO://callback",
                        "returnUrl": "http://www.baidu.com",
                        "returnType": "url",
                        "externalUserId": (getArgs().openId || getArgs().userId),
                        "externalSignNo": data.externalSignNo,
                        "isOpenAgreement": isOpenAgreement,
                        "contractNo": contract.contractNo,
                        "userName": contract.tenants.name,
                        "userAddress": userAddress,
                        "channel":"ALIPAYAPP",//接入渠道，用户接入渠道，取值范围： ALIPAYAPP：支付宝钱包 PC：PC端访问 WAP：WAP访问
                        // "channel":"alipaywap",//王家荣说的
                        // signValidityPeriod 王家荣说的，参数都不要，长期有效
                        // "signValidityPeriod":data.signValidityPeriod,//签约有效周期，可空，空值为长期有效，String(8)。当前用户签约请求的协议有效周期。 整形数字加上时间单位的协议有效期，从发起签约请求的时间开始算起。 目前支持的时间单位： d： 天 , m： 月 如果未传入，默认为长期有效。
                    };
                    console.log(sendToApp);
                    util.toDaiFu(sendToApp);

                } else {
                    console.log("申请创建交租订单失败:" + contract.contractId);
                }
            }
        });
    });
});


// function isNewAppOpen () {
//     var ua = window.navigator.userAgent;
//     // var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27/innjiaAppIos/4.2.3";
//     var iosNum = ua.substring( ua.indexOf("innjiaAppIos/4.2.3") ).split( "/" )[1].split(".")[2];
//     var androidNum = ua.substring( ua.indexOf("innjiaAppAndroid/4.2.3") ).split( "/" )[1].split(".")[2];
//     console.log( "iosNum",iosNum );
//     console.log( "androidNum",androidNum );
//     if(
//         (  iosNum >= 3 )
//         ||
//         ( androidNum >= 3 )
//     ) {
//         return true;
//     } else {
//         return false;
//     }
// }

//判断是否在app中打开
function isNewAppOpen() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(
        ( ua.match(/innjiaAppIos\/4\.2\.2/i) == 'innjiaappios/4.2.2' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.2/i) == 'innjiaappandroid/4.2.2' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.3/i) == 'innjiaappios/4.2.3' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.3/i) == 'innjiaappandroid/4.2.3' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.4/i) == 'innjiaappios/4.2.4' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.4/i) == 'innjiaappandroid/4.2.4' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.5/i) == 'innjiaappios/4.2.5' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.5/i) == 'innjiaappandroid/4.2.5' )
        ||
        ( ua.match(/innjiaAppIos\/4\.3/i) == 'innjiaappios/4.3' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.3/i) == 'innjiaappandroid/4.3' )
    ) {
        return true;
    } else {
        return false;
    }
}
