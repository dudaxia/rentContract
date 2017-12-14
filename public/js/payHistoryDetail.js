var historyRec;
var contract;
var isOpenAgreement = 0;

//查看合同详情
$("#check-contract").on("click",function(){
    window.location.href = "contractDetail.html?contractId="+getArgs().contractId+"&openId="+(getArgs().openId || getArgs().userId);
})

//
getPayHistoryDetail_6009();

//获取支付历史列表
function getPayHistoryDetail_6009() {
    var methodId = "6009";
    var methodParam = {originalId: (getArgs().openId || getArgs().userId)};
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            debugger
            if (jsonData && jsonData.code && jsonData.res && jsonData.res.data) {

                if ("0" == jsonData.code) {

                    $('.weui_loading_toast').hide();
                    $('.history-title, .history-list, .pay-info').show();

                    var data = jsonData.res.data;
                    contract = jsonData.res.data;

                    $('span[name=paidPeriod]').text(data.length);

                    var payHistory = data;
                    if( $.isArray(payHistory) && payHistory.length > 0) {
                       $.each(payHistory, function(i, j) {
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

getContractInfo();
//
function getContractInfo() {
    var methodId = "5021";
    var methodParam = {};
    methodParam.id = getArgs().contractId;
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            console.log("5021data",jsonData);
            $('#loadingToast').hide();

            var data = jsonData.res.data;

            if( data.status == '3' || data.status == '5' ) {
                $('.end-date').html( data.updateTime.split(" ")[0] );
            } else {
                $('.end-date').html( data.leaseEndTime.split(" ")[0] );
            }

            var addressStr = data.landlordHouse.areaName;
            $('.rent-address-wrapper').html(addressStr);

            // var domStr = '';
            // for( var i=0; i<data.rows.length; i++ ) {
            //     var addressStr = data.rows[i].roomProvince+data.rows[i].roomCity+data.rows[i].roomCounty+data.rows[i].roomAddress;
            //     domStr += '<div class="main-info" data-contractId='+ data.rows[i].contractId +'>'
            //             +  '<div class="rent-info">'
            //             +      '<p class="history-rent-date"><span name="lease-date">'+ data.rows[i].leaseDate +'</span></p>'
            //             +      '<p class="history-address">'+ addressStr +'</p>'
            //             +  '</div>'
            //             +  '<img class="history-arrow" src="../../../public/img/arrow_right.png">'
            //             +'</div>';
            // }
            // $('.rent-address-wrapper').html(domStr);
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
    if( payStatus == 1 ) {
        return repaymentDate.split(" ")[0];
    } else if ( payStatus == 2 ) {
        return planRepaymentDate.split(" ")[0];
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

//回退
$(".back-button").on('click', function (e) {
    // location.href = "innjia-js://closeView";
    history.back();
});




