// openId = "6b7bfb6869d43d188de01eb0327da5ab";
// contractId = "d6f6608a-4c3e-4e2c-b9f2-8d9c349afe17";

(function () {
    //set导航条颜色toApp
    var barStyleParams = {};
    barStyleParams.barFontColor = "1";//0:字体颜色为黑色     1：字体颜色为白色
    util.setBarStyle(barStyleParams);

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

    $('.back-button').on('click', function () {
        history.back();
    })

}).call(this);

function loadContractInfo(contractId){
    var methodId = "5021";
    var methodParam = {};
    methodParam.id = contractId;
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            var ajaxStr = "<div class='ajax-wrap'><b>RequestURL</b>:"+global.uip.url+"<br><b>methodId</b>:"+methodId+";<br><b>postData</b>:"+ JSON.stringify( info ) +";<br><b>Response</b>:"+JSON.stringify( jsonData )+"</div>";
            $('.ajax-detail').append(ajaxStr);

            if (jsonData.code == "0") {
                $('#loadingToast').hide();
                var data = jsonData.res.data;
                console.log('5021',data);
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

                $("span[name=noFixationStartTime]").html(data.noFixationStartTime.split(' ')[0]);
                $("span[name=noFixationEndTime]").html(data.noFixationEndTime.split(' ')[0]);

                $("span[name=payDay]").html(data.payDay);
                $("span[name=rent]").html(data.rent);

                $('#contractNext').attr("href", "tenantInfo.html?contractId=" + contractId);

                //合同已生效
                /*
                    1:待确认   2：已确认   3：已失效  4：已退租  5：已解约
                */
                if ('1' == data.status) {
                    $('.weui_btn_area.btn-submit').show();
                }else if ('2' == data.status) {
                    $('.main-status-icon').removeClass('unconfirm');
                } else if ( '3' == data.status ) {
                    $('.main-status-icon').removeClass('unconfirm').addClass('failure');
                } else if( '4' == data.status ) {
                    $('.main-status-icon').removeClass('unconfirm').addClass('out-contract');
                } else if ( '5' == data.status ) {
                    $('.main-status-icon').removeClass('unconfirm').addClass('cancel-contract');
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
            }
        },
        error: function () {
            $('#loadingToast').hide();
            $('.weui_toast_content').text("哎呀，出错了");
        }
    });
}
