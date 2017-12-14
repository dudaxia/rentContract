var data,leaseEndTime_break;

(function () {
debugger
    //set导航条颜色toApp
    var barStyleParams = {};
    barStyleParams.barFontColor = "1";//0:字体颜色为黑色     1：字体颜色为白色
    util.setBarStyle(barStyleParams);

    var openId = (getArgs().openId || getArgs().userId);

    if (!getArgs().openId && !getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
        return false;
    }
    if ('null' == getArgs().openId || 'null' == getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
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

    var methodId = "1045";
    var methodParam = {openId: openId};

    var info = postdata(methodId,methodParam);

     $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            $('#loadingToast').hide();
            console.log( jsonData );
            debugger;
            if (jsonData && jsonData.code && jsonData.res && jsonData.res.data) {

                // code == 419 表示没有还款计划： 您的房屋租约还没有确认哦
                if ("419" == jsonData.code) {
                    // debugger;
                    // location.href = "noContract.html";
                    location.href = "index.html?openId="+openId+"&contractId="+jsonData.res.data.contractId;
                }

                // code == 418 表示没有生效的合同：您当前没有房屋租约哦
                if ("418" == jsonData.code) {
                    location.href = "unconfirmed.html?tip=tip1&openId="+getArgs().openId;
                }

                // code == 410 当前没有正在进行中的合同
                if ("410" == jsonData.code) {
                    location.href = "noContract.html?tip=tip3&openId="+getArgs().openId;
                }

                // code == 0 表示有合同，可以支付
                // code == 420 表示租客已完善资料并已确认，但资方尚未放款
                if ("0" == jsonData.code || "420" == jsonData.code || "421" == jsonData.code) {
                    data = jsonData.res.data;
                    window.userContractId = data.contractId;
                    loadContractInfo(data.contractId);
                }
            } else {

            }
        },
        error: function () {
            $('#loadingToast').hide();
            $('.weui_toast_content').text("哎呀，出错了");
        }
    });

    $('.back-button').on('click', function () {
        location.href = "innjia-js://closeView";
    });


    //点击查看历史
    $('.history').on('click', function () {
        window.location.href = "historyList.html?openId="+(getArgs().openId || getArgs().userId);
    });

    // $('.check-contract').on('click', function () {
    //     window.location.href = "contractDetail.html?contractId="+getArgs().contractId+"&openId="+getArgs().openId;
    // });

})();

function loadContractInfo(contractId){
    $('#loadingToast').show();
    var methodId = "4019";
    var methodParam = {};
    methodParam.id = contractId;
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            if (jsonData.code == "0") {
                debugger;
                $('#loadingToast').hide();
                var data = jsonData.res.data;
                console.log('4019data',data);
                $("span[name=contractNo]").html(data.contractNo);
                $("span[name=tenantsName]").html(data.tenantsName);
                $("span[name=idCard]").html(data.tenantsInfo.idCard);
                $("span[name=tenantsPhone]").html(data.tenantsPhone);

                var landlordHouse = data.landlordHouse;
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
                leaseEndTime_break = data.fixationEndTime.split(' ')[0]

                $("span[name=noFixationStartTime]").html(data.noFixationStartTime.split(' ')[0]);
                $("span[name=noFixationEndTime]").html(data.noFixationEndTime.split(' ')[0]);

                $("span[name=payDay]").html(data.payDay);
                $("span[name=rent]").html(data.rent);

                $('#contractNext').attr("href", "tenantInfo.html?contractId=" + contractId)

                //退租信息
                // if( data.payMonthlyStatus == "OrderRepayment" ) {//可发起退租
                if( (2 == data.status) && (data.payMonthlyStatus != "OrderPreOutMemberApply") && (data.payMonthlyStatus != "OrderPreOutApply") ) {//可发起退租
                    $('#break-contract').show();
                    if (2 == data.status) {
                        $('.main-status-icon').removeClass('unconfirm');
                    }
                    if (1 == data.status) {
                        $('.weui_btn_area.btn-submit').show();
                    }

                } else if( data.payMonthlyStatus == "OrderPreOutMemberApply" ) {//已发起退租
                    if( data.contractExit ) {
                        if( data.contractExit.isLandlordSend == '1' ) {//房东发起退组
                            //图标不进行任何操作，提示信息显示
                            $('.landlord-break-tips').show();
                            if (2 == data.status) {
                                $('.main-status-icon').removeClass('unconfirm');
                            }
                            if (1 == data.status) {
                                $('.weui_btn_area.btn-submit').show();
                            }
                        } else if( data.contractExit.isLandlordSend == '0' ) { //租客发起退组，改变图标
                            $('.main-status-icon').removeClass('unconfirm').addClass('break-checking');
                        }
                    }
                } else if( data.payMonthlyStatus == "OrderPreOutApply" ){//双方同意退租
                    if (2 == data.status) {
                        $('.main-status-icon').removeClass('unconfirm');
                    }
                    if (1 == data.status) {
                        $('.weui_btn_area.btn-submit').show();
                    }
                    if( data.contractExit ) {
                        $('.rent-info-content.old').css({color:'#c0c0c0'});
                        $('.rent-info-content.old').hide();
                        $('.rent-info-content.pro-break').show();
                        $('.rent-info-title.change').html('固定租期（<span style="color:#ff6138;">提前退租</span>）');
                        $(".rent-info-content.pro-break span[name=leaseStartTime]").html(data.fixationStartTime.split(' ')[0]);
                        // var exitDate1 = data.contractExit.exitDate ? data.contractExit.exitDate.split(' ')[0] : '';
                        $(".rent-info-content.pro-break span[name=leaseEndTime]").html(data.contractExit.exitDate.split(' ')[0]);
                    }
                }

                // if (2 == data.status) {
                //     $('.main-status-icon').removeClass('unconfirm');
                // }
                // if (1 == data.status) {
                //     $('.weui_btn_area.btn-submit').show();
                // }

                $('.next-step').on('click', function () {
                    location.href = "tenantInfo.html?contractId=" + contractId + "&openId=" + data.tenantsInfo.openId;
                });

                $('.check-contract').on('click', function () {
                    location.href = "contractDetail.html?contractId="+contractId+"&openId="+getArgs().openId;
                });
            } else {
                $('.weui_toast_content').text(jsonData.code + ": " + jsonData.res.msg);
                $('#loadingToast').show();
            }
        }
    });
}

$('.landlord-break-tips').on('click',function() {
    window.location.href = "checkout.html?contractId="+window.userContractId+"&openId="+getArgs().openId;
})


var breakContractProcess = {
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        this.breakBtnClick();
        this.applyBreakContractClick();
        this.closeFn();
    },
    breakBtnClick: function(){
        var _this = this;
        $('#break-contract').on('click',function() {
            $('.break-contract-wrapper').show();
        });
    },
    applyBreakContractClick: function() {
        var _this = this;
        $('#applyBreakContract').on('click',function() {
            if( $('#applyBreakContract').hasClass('disable-click') ) {
                return false;
            } else {
                _this.post_1050();
            }
        });
    },
    post_1050: function() {
        var methodId = "1050";
        var methodParam = {};
        methodParam.initiatorOpenId = getArgs().openId;
        methodParam.contractId = window.userContractId;
        methodParam.exitDate = $('#choice-data').val();
        methodParam.statusName = 'OrderPreOutMemberApply';
        var info = postdata(methodId,methodParam);
        console.log('post1050',methodParam);
        // console.log('info',info);

        var getTimeByDateString = function (str) {
            var _tmp = str ? new Date(str) : new Date();
            console.log(_tmp);
            var _str = _tmp.getFullYear() + "-" + (_tmp.getMonth() + 1) + "-" + _tmp.getDate();
            return (new Date(_str)).getTime();
        }

        var getNowTime = function() {
            var date = new Date();
            var str = '';
            str = date.getFullYear() + '-' + addZero( date.getMonth() + 1 ) + "-" + addZero( date.getDate() );
            return str;
        }

        var addZero = function ( num ) {
            if( num >= 10 ) {
                return num;
            } else {
                return '0'+num;
            }
        }

        console.log( "getNowTime",getNowTime() );
        console.log( "pickTime",$('#choice-data').val() );
        var dateNow = getNowTime();
        var datePick = $('#choice-data').val();

        // var d = new Date();
        // var dateNow = getTimeByDateString();
        // var datePick = getTimeByDateString($('#choice-data').val());
        // console.log("dateNow",dateNow);
        // console.log("datePick",datePick);

        if( (datePick < dateNow) || (datePick > leaseEndTime_break) ) {
            // alert( "退租日期为次日起至租约到期日" );
            $(".weui_dialog_bd.prompt_text").html( "退租日期为当日起至租约到期日" );
            $("#dialog.weui_dialog_alert").show();
            return false;
        }

        $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            success: function(jsonData) {
                //$('.weui_loading').hide();
                $('.break-contract-wrapper').hide();
                $('.weui_toast_content').text("已提交申请");
                $('#loadingToast').show();
                setTimeout(function(){
                    $('#loadingToast').hide();
                    window.location.href = 'myContract.html?contractId='+window.userContractId+'&openId='+getArgs().openId;
                },1500);
            },
            error: function() {
                alert("error");
            }
        });
    },
    closeFn: function () {
        $('.break-contract-wrapper .break-close-icon').on('click',function() {
            $(this).parents('.break-contract-wrapper').hide();
        });
        $(".weui_btn_dialog.primary").on("click",function() {
            $('.weui_dialog_alert').hide();
        })
    }
}
breakContractProcess.init();
