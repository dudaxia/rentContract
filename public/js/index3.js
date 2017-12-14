// openId = "6b7bfb6869d43d188de01eb0327da5ab";
// contractId = "d6f6608a-4c3e-4e2c-b9f2-8d9c349afe17";

(function () {
    //set导航条颜色toApp
    var barStyleParams = {};
    barStyleParams.barFontColor = "1";//0:字体颜色为黑色     1：字体颜色为白色
    util.setBarStyle(barStyleParams);

    //埋点
    var key = 24000;
    var url = "http://qd.innjia.com:8032/ch?key=" + key;
    $.get(url);

    function isAppOpen() {
        var ua = window.navigator.userAgent.toLowerCase();
        if(
            ( ua.match(/innjiaAppIos/i) == 'innjiaappios' )
            ||
            ( ua.match(/innjiaAppAndroid/i) == 'innjiaappandroid' )
        ) {
            return true;
        } else {
            return false;
        }
    }
    if( isAppOpen() ) {
        $('.back-icon').show();
        $('.back-button').on('click', function () {
            location.href = "innjia-js://closeView";
        });
    }

    var contractId = getArgs().contractId;

    if (!getArgs().contractId) {
        $('.weui_toast_content').text("呐尼？信息错了！");
        return false;
    }
    if (!getArgs().openId && !getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
        return false;
    }
    if ('null' == getArgs().openId || 'null' == getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
        return false;
    }

    loadContractInfo(contractId);

    $('.check-contract').on('click', function () {
        window.location.href = "contractDetail.html?contractId="+getArgs().contractId+"&openId="+(getArgs().openId || getArgs().userId);
    });

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
            if( data.rows.length == 0 ) {
                $('.history-icon').hide();
            } else {
                $('.history-icon').show();
            }
        }
    });

    //点击查看历史
    $('.history').on('click', function () {
        window.location.href = "historyList.html?openId="+(getArgs().openId || getArgs().userId);
    });

    //
    $('.weui_btn_dialog.default').on('click',function() {
        $('.weui_dialog_confirm').hide();
    });

    $('.weui_btn_dialog.primary').on('click',function() {
        if( isIOS ) {
            if( isQQNavigator() ) {
                $('.weui_btn_dialog.primary').attr("href","ZUHOUSHENGHUO://myRentContractPage");
            } else {
                window.location.href = "ZUHOUSHENGHUO://myRentContractPage";
            }
        } else if( isAndroid ) {
           // $('.weui_btn_dialog.primary').attr("href","innjia://rent_contract_page");
           if( isQQNavigator() ) {
                $('.weui_btn_dialog.primary').attr("href","innjia://rent_contract_page");
            } else {
                window.location.href = "innjia://rent_contract_page";
            }
        }
        window.setTimeout(function(){
           window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.innjiabutler.android.chs";
        },3000);
        $('.weui_dialog_confirm').hide();
    });


}).call(this);

function loadContractInfo(contractId){
    var methodId = "4019";
    var methodParam = {};
    methodParam.id = contractId;
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
          console.log(jsonData);
            if (jsonData.code == "0") {
                $('#loadingToast').hide();

                if( isAndroid && !isWeiXinNavigator() && !isAppFlag ) {
                  setTimeout(function(){
                      $('.weui_dialog_confirm').show();
                  },1000);
                } else if( !isAppFlag && !isWeiXinNavigator() ) {
                    if( isQQNavigator() ) {
                        setTimeout(function(){
                            $('.weui_dialog_confirm').show();
                        },1000);
                     } else {
                        $('.weui_btn_dialog.primary').click();
                    }
                } else if( !isAppFlag && isWeiXinNavigator() ){
                    setTimeout(function(){
                        $('.openin-other').show();
                    },1000);
                }
                if( isAppFlag ) {
                    $('.back-icon').show();
                }
                var data = jsonData.res.data;
                $("span[name=contractNo]").html(data.contractNo);
                $("span[name=tenantsName]").html(data.tenantsName);
                $("span[name=idCard]").html(data.tenantsInfo.idCard);
                $("span[name=tenantsPhone]").html(data.tenantsPhone);

                var landlordHouse = data.landlordHouse || {};
                $("span[name=lcHouseName]").html(landlordHouse.companyName || landlordHouse.name);
                if (!landlordHouse.companyAddress) {
                    $('.companyAddr').hide();
                } else {
                    $('.lcCompanyAddr').text(landlordHouse.companyAddress);
                }
                // var addr = landlordHouse.roomProvince + "-" + landlordHouse.roomCity + "-" + landlordHouse.roomCounty + "-" + landlordHouse.areaName + "-" + landlordHouse.roomAddress;
                var addr = landlordHouse.roomCity + "-" + landlordHouse.roomCounty + "-" + landlordHouse.areaName + "-" + landlordHouse.roomAddress;
                $("span[name=lcHouseAddr]").html(addr);

                $("span[name=leaseStartTime]").html(data.fixationStartTime.split(' ')[0]);
                $("span[name=leaseEndTime]").html(data.fixationEndTime.split(' ')[0]);

                $("span[name=noFixationStartTime]").html(data.noFixationStartTime.split(' ')[0]);
                $("span[name=noFixationEndTime]").html(data.noFixationEndTime.split(' ')[0]);

                $("span[name=payDay]").html(data.payDay);
                $("span[name=rent]").html(data.rent);

                $('#contractNext').attr("href", "tenantInfo.html?contractId=" + contractId);

                //合同已生效
                if (1 == data.status) {
                    $('.weui_btn_area.btn-submit').show();
                }else if (2 == data.status) {
                  $('.main-status-icon').removeClass('unconfirm');
                } else {
                  $('.main-status-icon').removeClass('unconfirm').addClass('failure');
                }

                //合同待确认
                // if (1 == data.status) {
                //     $('.weui_btn_area.btn-submit').show();
                // }

                $('.next-step').on('click', function () {

                    location.href = "tenantInfo.html?contractId=" + contractId + "&openId=" + data.tenantsInfo.openId;
                });
            } else {
                $('.weui_toast_content').text(jsonData.code + ": " + jsonData.res.msg);
                $('#loadingToast').show();
            }
        },
        error: function () {
            $('#loadingToast').hide();
            $('.weui_toast_content').text("哎呀，出错了");
            $('#loadingToast').show();
        }
    });
}

//根据是否有历史租约 控制图标的显示与隐藏
function isHasHistory() {
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

            var ajaxStr = "<div class='ajax-wrap'><b>RequestURL</b>:"+global.uip.url+"<br><b>methodId</b>:"+methodId+";<br><b>postData</b>:"+ JSON.stringify( info ) +";<br><b>Response</b>:"+JSON.stringify( jsonData )+"</div>";
            $('.ajax-detail').append(ajaxStr);

            var data = jsonData.res.data;
            if( data.rows.length == 0 ) {
                $('.history-icon').hide();
            } else {
                $('.history-icon').show();
            }
        }
    });
}

var ua = window.navigator.userAgent.toLowerCase();
var isAndroid = ua.match(/Android/i);
var isIOS = ua.match(/iphone|ipod|ipad/i);

function isAppOpen() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(
        ( ua.match(/innjiaAppIos/i) == 'innjiaappios' )
        ||
        ( ua.match(/innjiaAppAndroid/i) == 'innjiaappandroid' )
    ) {
        return true;
    } else {
        return false;
    }
}
var isAppFlag = isAppOpen();

//判断是否是微信浏览器
function isWeiXinNavigator() {
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

//判断是否是QQ内置浏览器
function isQQNavigator() {
    if(ua.match(/qq/i) == 'qq'){
        return true;
    }else{
        return false;
    }
}
//alert( isQQNavigator() );
