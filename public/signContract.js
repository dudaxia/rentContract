
var contractId = getArgs().contractId;
var screenWidth = document.body.clientWidth;


loadContractInfo(contractId);

$('.page-sign .back-button').on('click', function () {
    $('.js-signature').jqSignature('clearCanvas');
    $('.page-sign').hide();
    $('.footer1').show();
    $('.page-contract').show();
})

//点击 签名
$('.sign-click').on('click',function() {

    $('.page-contract').hide();
    $('.footer1').hide();
    $('.page-sign').show();
    var wp = new WritingPad();
    wp.init();
});

//签名后 点击 确认签名
$('.sure-btn').on('click',function() {
    $('.mobile-wrapper').show();
});

//输入验证码框 点击 确认
$('.get-code').on('click',function() {
    clickGetCode();
});

//最后一步 确认合同
$('.mobile-sure').on('click',function() {
    $('.mobile-wrapper').hide();
    upLoadSignNamePic();
});

//上传签名照片
function upLoadSignNamePic() {
    var methodId = "6011";
    var methodParam = {};
    methodParam.ContractId = getArgs().contractId;
    methodParam.OriginalId = getArgs().openId;
    methodParam.ImageStream = $('.footer2 .sign-name img').attr('src');
    methodParam.VerifyCode = $('#input-code').val();
    methodParam.TeantsLocation = "121.495638,31.225836";
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (res) {
            console.log( "6011",res );
            if( res.code == '0' ) {
                showIconDialog("您的房屋租约已确认成功啦<br>现在可以去付租了哦", "确认成功", function (dialog) {
                    location.href = "index.html?contractId="+getArgs().contractId+"&openId="+getArgs().openId;
                }, function (dialog) {
                    location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.innjiabutler.android.chs";
                });
            } else {
                showDialog(null, res.code + ": " + res.res.msg);
            }
        }
    });
}

var userMobile = '';
var getCodeBtn = $('.get-code');
var getCodeFlag = true;
//获取验证码
function clickGetCode() {
    if( getCodeFlag ) {
        getCodeFlag = false;
        remainingTime();
        getCode();
    }
}
//
function  getCode() {
    var methodId = "N003";
    var methodParam = {};
    methodParam.cellPhone = userMobile;
    var info = postdata(methodId,methodParam);

    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (res) {
            console.log( "N003",res )
        }
    });
  }
//时间倒计时
function remainingTime() {
    var counting = 60;
    var timer = setInterval(function() {
      getCodeBtn.html("重新获取(" + (counting--) + "S)");
      if( counting < 0 ) {
        getCodeBtn.html("获取验证码");
        getCodeFlag = true;
        clearInterval( timer );
      }
    },1000);
}

//输入验证码 取消
$('.mobile-cancel').on('click',function() {
    $('.mobile-wrapper').hide();
});

//时间格式化
function dateFmt (start, end) {
    var splitDate = function (adate) {
        var datepart = adate.split(" ")[0].split("-");
        return { "y":datepart[0], "m":datepart[1]*1, "d":datepart[2]*1 };
    }
    var s = splitDate(start), e = splitDate(end);
    return s.y+"年"+s.m+"月"+s.d+"日"+"至"+e.y+"年"+e.m+"月"+e.d+"日";
}

//读取合同信息
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
            if (jsonData.code == "0") {
                var data = jsonData.res.data;
                var tenantsInfoAddress = (data.landlordHouse.roomProvince || "")
                     + (data.landlordHouse.areaName || "")
                     + (data.landlordHouse.roomAddress || "")
                     + (data.landlordHouse.roomCode || "");

                $('span[name=landlordHouse_companyName]').text(data.landlordHouse.companyName || data.landlordHouse.name);
                // $('span[name=landlordHouse_companyAddress]').text(data.landlordHouse.companyAddress);
                if (data.landlordDetail && data.landlordDetail.companyAddress) {
                    $('span[name=landlordHouse_companyAddress]').text(data.landlordDetail.companyAddress);
                }
                $('span[name=tenantsInfo_name]').text(data.tenantsInfo.name);
                $('span[name=tenantsInfo_idCard]').text(data.tenantsInfo.idCard);
                $('span[name=area_name]').text(data.landlordHouse.areaName);
                $('span[name=tenantsInfo_address]').text(tenantsInfoAddress);
                $('span[name=tenantsInfo_mobile]').text(data.tenantsInfo.mobile);
                $('span.phone-num').text(data.tenantsInfo.mobile);
                userMobile = data.tenantsInfo.mobile;
                $('span[name=tenantsInfo_fulladdress]').text(data.tenantsInfo.fulladdress);
                $('span[name=leaseTime]').text(dateFmt(data.leaseStartTime, data.leaseEndTime));
                $('span[name=fixationTime]').text(dateFmt(data.fixationStartTime, data.fixationEndTime));
                $('span[name=noFixationTime]').text(dateFmt(data.noFixationStartTime, data.noFixationEndTime));
                $('span[name=rent]').text(data.rent);
                $('span[name=deposit]').text(data.deposit);
                $('span[name=tenantsInfo_contactName]').text(data.tenantsInfo.contactName);
                $('span[name=tenantsInfo_contactRelationship]').text(data.tenantsInfo.contactRelationship);
                $('span[name=tenantsInfo_bankAccount]').text(data.tenantsInfo.bankAccount);
                $('span[name=houseSize]').text(data.landlordHouse.houseSize);
                $('p[name=supplement]').html(html_encode(data.supplement || ''));
                $('span[name=leasePayDay]').html( data.payDay );
                $('span[name=leasePayType]').html( payType( data.rentPayType ) );


                if (2 == data.status) {
                }
                if (1 == data.status) {
                }

            } else {
                alert(jsonData.code + ": " + jsonData.res.msg);
            }
        }
    });
}

//补充条款
function html_encode(str) {
    var s = "";
    if (str.length == 0) {
        return "";
    }
    s = str.replace(/&/g, "&gt;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/↵/g, "<br>");
    s = s.replace(/<br><br>/g, "<br>");
    return s;
}

//付款类型
function payType( leasePayType ) {
    if( leasePayType == "0" ) {
        return "一月一付";
    } else if( leasePayType == "1" ) {
        return "二月一付";
    } else if( leasePayType == "2" ) {
        return "三月一付";
    }else {
        return "";
    }
}
