util.getLocationMessage();

$('.clause').on('click', function () {
    $(this).find('.cluase-icon').toggleClass('checked');
});

$('.back-button').on('click', function () {
    history.back();
})

$('.check-cluase').on('click', function () {
    location.href = "protocol.html?contractId=" + getArgs().contractId;
});


var orderProcessStatus = "OrderGenerating";
var positiveIdCard ;//= memObj.localData['member_memberPhotoInfo_positiveIdCard'];
//positiveIdCard = !!positiveIdCard ? positiveIdCard.split(",") : null;
$(".id-card-01").uploadImage({
    url: global.uip.photoUrl,// globalUploadHost + uploadUrl,
    idCard: "8a28cd6e586797fc015867a6a2eb001d",//landlordUserInfo.id,
    preAddress:global.uip.preAddress,// imageAddress,
    defaultImage: "../../../public/img/shenzhengmian@2x.png",
    fileImage: positiveIdCard,
    /*是否启动自增自减*/
    autoAppend: false,
    /*如果启动了自增减，那么这个参数必须传*/
    autoMax: 3,
    readonly: (function() {
        return ("OrderLandLordSupplement" === orderProcessStatus ? true : false)
    }()),
    onchange: function($el) {
        var list = $(".id-card-01 .uploadFileAddress")[0], string;
        if (list) {
            string = list.value;
        }
        $("input[name='member.memberPhotoInfo.positiveIdCard']").val(string);
        save({ "contractId": getArgs().contractId, "positiveIdCard": string });
    }
});
var backIdCard ;//= memObj.localData['member_memberPhotoInfo_backIdCard'];
//backIdCard = !!backIdCard ? backIdCard.split(",") : null;
$(".id-card-02").uploadImage({
    url: global.uip.photoUrl,//globalUploadHost + uploadUrl,
    idCard: "8a28cd6e586797fc015867a6a2eb001d",//landlordUserInfo.id,

    defaultImage: "../../../public/img/shenfenzheng@2x.png",
    preAddress: global.uip.preAddress,//imageAddress,
    fileImage: backIdCard,
    readonly: (function() {
        return ("OrderLandLordSupplement" === orderProcessStatus ? true : false)
    }()),
    onchange: function($el) {
        var list = $(".id-card-02 .uploadFileAddress")[0], string;
        if (list) {
            string = list.value;
        }
        $("input[name='member.memberPhotoInfo.backIdCard']").val(string);
        save({ "contractId": getArgs().contractId, "backIdCard": string });
    }
});

var takeIdCard;
$(".id-card-03").on('click',function() {
$($('.id-card-03').find('input')[1]).prop('disabled', true);
     $('.take_id_tip').show();

});
$('.getIt-btn').on('click',function() {
    $(this).parents('.take_id_tip').remove();
    $($('.id-card-03').find('input')[1]).removeAttr('disabled');

    $(".id-card-03").off('click');
    $('.id-card-03').find('input[type=file]').click();
})

$(".id-card-03").uploadImage({
    url: global.uip.photoUrl,//globalUploadHost + uploadUrl,
    idCard: "8a28cd6e586797fc015867a6a2eb001d",//landlordUserInfo.id,
    defaultImage: "../../../public/img/handleCard@2x.png",
    preAddress: global.uip.preAddress,//imageAddress,
    fileImage: takeIdCard,
    readonly: (function() {
        return ("OrderLandLordSupplement" === orderProcessStatus ? true : false)
    }()),
    onchange: function($el) {
        var list = $(".id-card-03 .uploadFileAddress")[0], string;
        if (list) {
            string = list.value;
        }
        $("input[name='member.memberPhotoInfo.takeIdCard']").val(string);
        save({ "contractId": getArgs().contractId, "takeIdCard": string });
    }
});

function save(data){
    $.ajax({
        url: global.uip.url,
        type: "post",
        data: postdata("4039",data),
        // beforeSend:function(){
        //     $('.weui_loading_toast').show();
        //     $('.weui_loading_toast .weui_toast_content').html("图片上传中");
        // },
        success: function (jsonData) {
            $('.weui_loading_toast').hide();
            $('.weui_loading_toast .weui_toast_content').html("");
            console.log(jsonData);
        }
    });
}

function postContract(param) {
    var methodId = "4028";

    var info = postdata(methodId,param);

    $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            success: function (jsonData) {
                if (jsonData.code == "0") {
                    // $('#loadingToast').hide();
                   var contractId = $('#datacontainer').data("contractId");

                   // 如果在app中则隐藏去下载app按钮
                   // $('.weui_dialog_icon .weui_btn_dialog.btn-close').hide();

                    // window.location.href = "monthlyPayRent.html?contractId=" + contractId;
                    showIconDialog("您的房屋租约已确认成功啦<br>现在可以去付租了哦", "确认成功", function (dialog) {
                        location.href = "index.html?contractId="+getArgs().contractId+"&openId="+getArgs().openId;
                    }, function (dialog) {
                        location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.innjiabutler.android.chs";
                    });
                } else {
                    showDialog(null, jsonData.code + ": " + jsonData.res.msg);
                }
            },
            error: function () {
                $('.weui_toast_content').text("接口错误");
            }
        });
}

function loadContractInfo(){
    var methodId = "4019";
    var methodParam = {};
    methodParam.id = getArgs().contractId;
    var info = postdata(methodId,methodParam);

     $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            if (jsonData.code == "0") {
                // $('#loadingToast').hide();
                var data = jsonData.res.data;
                console.log( "4019",jsonData );
                $("#backAccount").val(data.tenantsInfo.bankAccount);
                $("#tenantBankMobile").val(data.tenantsInfo.tenantBankMobile);
                $("#contactRelationship").val(data.tenantsInfo.contactRelationship);
                $("#contactName").val(data.tenantsInfo.contactName);
                $("#tenantName").text(data.tenantsInfo.name);
                $("#contactMobile").val(data.tenantsInfo.contactMobile);
                // $("input[name=idCard]").val(data.tenantsInfo.idCard);
                if( data.tenantsInfo.positiveIdCard ) {
                    $(".id-card-01 .pic-area .fileView.preview img").attr( 'src',global.uip.preAddress+data.tenantsInfo.positiveIdCard );
                    $(".id-card-01 .pic-area").addClass('success');
                    $(".id-card-01 .uploadFileAddress").val( data.tenantsInfo.positiveIdCard );
                    $('input[name="landlord.positiveIdCard"]').val( data.tenantsInfo.positiveIdCard );
                    $('input[name="member.memberPhotoInfo.positiveIdCard"]').val( data.tenantsInfo.positiveIdCard );
                }
                if( data.tenantsInfo.backIdCard ) {
                    $(".id-card-02 .pic-area .fileView.preview img").attr( 'src',global.uip.preAddress+data.tenantsInfo.backIdCard );
                    $(".id-card-02 .pic-area").addClass('success');
                    $(".id-card-02 .uploadFileAddress").val( data.tenantsInfo.backIdCard );
                    $('input[name="landlord.backIdCard"]').val( data.tenantsInfo.backIdCard );
                    $('input[name="member.memberPhotoInfo.backIdCard"]').val( data.tenantsInfo.backIdCard );
                }
                if( data.tenantsInfo.takeIdCard ) {
                    $(".id-card-03 .pic-area .fileView.preview img").attr( 'src',global.uip.preAddress+data.tenantsInfo.takeIdCard );
                    $(".id-card-03 .pic-area").addClass('success');
                    $(".id-card-03 .uploadFileAddress").val( data.tenantsInfo.takeIdCard );
                    $('input[name="landlord.takeIdCard"]').val( data.tenantsInfo.takeIdCard );
                    $('input[name="member.memberPhotoInfo.takeIdCard"]').val( data.tenantsInfo.takeIdCard );
                }
            } else {
                // $('#loadingToast').hide();
                alert(jsonData.code + ": " + jsonData.res.msg);
            }
        }
    });
}

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

if( isAppFlag ) {
    $('.weui_btn_dialog.btn-close').hide();
    $('.weui_btn_dialog.primary.stay_here').css({"width": "100%"});
}

//判断是否在app中打开
function isNewAppOpen() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(
        ( ua.match(/innjiaAppIos\/4\.2\.2]/i) >= 'innjiaappios/4.2.2' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.2/i) >= 'innjiaappandroid/4.2.2' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.3/i) >= 'innjiaappios/4.2.2' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.3/i) >= 'innjiaappandroid/4.2.2' )
    ) {
        return true;
    } else {
        return false;
    }
}

// function isNewAppOpen () {
//     var ua = window.navigator.userAgent;
//     var index = ua.indexOf("innjiaAppIos/4.2.2") || ua.indexOf("innjiaAppIos/4.2.3") || ua.indexOf("innjiaAppAndroid/4.2.2") || ua.indexOf("innjiaAppAndroid/4.2.3");
//     var iosNum = ua.substring( index ).split( "/" )[1].split(".")[2];
//     var androidNum = ua.substring( index ).split( "/" )[1].split(".")[2];
//     console.log( "iosNum",iosNum );
//     console.log( "androidNum",androidNum );
//     if(
//         (  iosNum >= 2 )
//         ||
//         ( androidNum >= 2 )
//     ) {
//         return true;
//     } else {
//         return false;
//     }
// }

//app传入经纬度
var appLocation;
function locationBeenGot(lng,lat) {
    appLocation = "" + lng + "," + lat;
}


$(function () {

    $('.confirm-contract-button').on('click', function(){

        var positiveIdCard = $('input[name="member.memberPhotoInfo.positiveIdCard"]').val();
        var backIdCard = $('input[name="member.memberPhotoInfo.backIdCard"]').val();
        var takeIdCard = $('input[name="member.memberPhotoInfo.takeIdCard"]').val();
        console.log( "positiveIdCard",positiveIdCard );
        console.log( "backIdCard",backIdCard );
        console.log( "takeIdCard",takeIdCard );
        if (!positiveIdCard) {
            showDialog(null, "请上传身份证正面照");
            return false;
        }
        if (!backIdCard) {
            showDialog(null, "请上传身份证反面照");
            return false;
        }
        if (!takeIdCard) {
            showDialog(null, "请上传自拍手持身份证照");
            return false;
        }

        if ( !$('.cluase-icon').hasClass('checked') ) {
            showDialog(null, "请同意房租月付条款");
            return false;
        }

        var contractId = $("#datacontainer").data("contractId");

        var param = {};
        param.positiveIdCard = positiveIdCard;
        param.backIdCard = backIdCard;
        param.takeIdCard = takeIdCard;
        param.contractId = contractId;
        param.openId = getArgs().openId;

        if( isNewAppOpen() ) {
            param.teantsLocation = appLocation;
        } else {
            param.teantsLocation = window.teantsLocation;
        }
        postContract(param);
    });

    var contractId = getArgs().contractId;

    if (!getArgs().contractId) {
        $('.weui_toast_content').text("入口参数缺少合同id");
        return false;
    }
    if (!getArgs().openId && !getArgs().userId) {
        $('.weui_toast_content').text("入口参数缺少openId");
        return false;
    }
    if ('null' == getArgs().openId || 'null' == getArgs().userId) {
        $('.weui_toast_content').text("入口参数openId错误");
        return false;
    }

    loadContractInfo();

    $("#datacontainer").data("contractId", contractId);
})


