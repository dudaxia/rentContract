util.getLocationMessage();

//埋点
var key = 24002;
var url = "http://qd.innjia.com:8032/ch?key=" + key;
$.get(url);

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
        //埋点
        var key = 24003;
        var url = "http://qd.innjia.com:8032/ch?key=" + key;
        $.get(url);

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
        //埋点
        var key = 24004;
        var url = "http://qd.innjia.com:8032/ch?key=" + key;
        $.get(url);

        var list = $(".id-card-02 .uploadFileAddress")[0], string;
        if (list) {
            string = list.value;
        }
        $("input[name='member.memberPhotoInfo.backIdCard']").val(string);
        save({ "contractId": getArgs().contractId, "backIdCard": string });
    }
});

var takeIdCard , clickCount = 1 , imgFile;

$(".id-card-03").on('click',function() {
    if( (clickCount>1) && true ) {
        // photoWithFaceHasBeenGot(base64img);
        imgFile = util.getPhotoWithFace();
        // console.log(imgFile);
    }
    clickCount++;
    if( isNewAppOpen424() && _isIosApp() ) {

    } else {
        $($('.id-card-03').find('input')[1]).prop('disabled', true);
    }
    // $($('.id-card-03').find('input')[1]).prop('disabled', true);
    $('.take_id_tip').show();

});

$('.getIt-btn').on('click',function() {
    $(this).parents('.take_id_tip').remove();
    // $($('.id-card-03').find('input')[1]).removeAttr('disabled');

    // $(".id-card-03").off('click');
    // $('.id-card-03').find('input[type=file]').click();

    // IOS 4.2.4新版本中打开
    if( isNewAppOpen424() && _isIosApp() ) {
        // photoWithFaceHasBeenGot(base64img);
        // $(".id-card-03 .pic-area").append('<input type="file" accept="image/*" name="uploadFile">');
        imgFile = util.getPhotoWithFace();
        // console.log(imgFile);
    } else {
        $($('.id-card-03').find('input')[1]).removeAttr('disabled');
        $(".id-card-03").off('click');
        $('.id-card-03').find('input[type=file]').click();
    }
})

//图片压缩
function compressImage(img,compressWidth) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

    var imgWidth=img.naturalWidth/1.2;
    var imgHeight=img.naturalHeight/1.2;
    var ctxImgHeight;
    if( imgWidth >= imgHeight ) {
        ctxImgHeight= (compressWidth)*(imgHeight/imgWidth);
    } else {
        ctxImgHeight= (compressWidth)*(imgWidth/imgHeight);
    }
    var ctxImgHeight= (compressWidth)*(imgHeight/imgWidth);
    canvas.width=compressWidth;
    canvas.height=ctxImgHeight;
    ctx.clearRect(0, 0, compressWidth, ctxImgHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, compressWidth, ctxImgHeight);
    ctx.drawImage(img,0,0,compressWidth,ctxImgHeight);
    var base64 = canvas.toDataURL("image/jpeg",0.98);
    return base64;
}

//图片上传2
function corsUpload(callback,base64) {
    var $formData = new FormData();
    $formData.append("img", base64 || "");

    $.ajax(global.uip.photoUrl, {
        url: global.uip.photoUrl,
        type: 'POST',
        dataType: 'json',
        data: $formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function(data, status, res) {
            return callback( data, res);
        },
        error: function() {
            console.log("error....")
                // debugger
        }
    });
}

var options = {
    fileImage: takeIdCard,
    onchange: function($el) {
        //埋点
        var key = 24005;
        var url = "http://qd.innjia.com:8032/ch?key=" + key;
        $.get(url);

        var list = $(".id-card-03 .uploadFileAddress")[0], string;
        if (list) {
            string = list.value;
        }
        $("input[name='member.memberPhotoInfo.takeIdCard']").val(string);
        save({ "contractId": getArgs().contractId, "takeIdCard": string });
    }
};

//图片上传1
function uploadSuccessDone($el, data) {
    var filePath = data.res.msg;

    // $el.find(".pic-area .fileView img").attr('src', base64 ? base64 : (self.options.preAddress + filePath) );
    $el.find(".pic-area .fileView img").attr('src', global.uip.preAddress + filePath);
    $el.find(".uploadFileAddress").val(filePath);
    $el.find(".pic-area").addClass('success');
    $el.find(".remove").show();
    $el.off("click", ".remove");
    $el.on("click", ".remove", function(e) {
        e.stopPropagation();
        options.fileImage.pop();
        var ul = $el.find(".upload").length;
        if (ul >= 2) {
            $el.remove();
        } else {
            $el.find(".remove").hide();
            $el.find(".uploadFileAddress").val("");
            $el.find(".pic-area .fileView img").attr("src", "");
            $el.find(".pic-area").removeClass('success');
            $el.find("input[type='file']").val("");
        }
        options.onchange && options.onchange($el);
    });

    options.fileImage = [];

    $el.find(".upload .uploadFileAddress").each(function(i, k) {
        if (k.value !== "") {
            options.fileImage.push(k.value);
        }
    });
    $el.removeClass("modal2").addClass("modal1");
    // self.options.callback && self.options.callback($el, file, data, resp);
    self.options.onchange && self.options.onchange($el);
    // self.autoAppend();
}

//在IOS 4.2.4版本APP中打开
if( isNewAppOpen424() && _isIosApp() ) {
    function photoWithFaceHasBeenGot(imgBase64) {

        var tm = 0;
        window.timer = setInterval( function(){

            $('.weui_loading_toast').show();
            $('.weui_loading_toast .weui_toast_content').html("图片上传中"+tm+"%");
            tm += 5;
            if( tm >= 95 ) {
                clearInterval(window.timer);
            }
        },1000 );

        var imgBase64 = "data:image/jpeg;base64,"+imgBase64;
        // var imgBase64 = imgBase64;
        console.log("imgBase64",imgBase64.length)
        // alert(imgBase64.length)
        // $(".id-card-03 .pic-area").append('<input type="file" accept="image/*" name="uploadFile" onchange="openFile(event)">');
        // openFile(e);
        // $('#datacontainer').append('<img src="'+ imgBase64 +'">');
        var img = new Image();
        img.src = imgBase64;
        img.onload = function () {
            var base64 = compressImage(img,900);
            console.log("base64",base64.length)
            // alert(base64.length)
            corsUpload( (function() {
                return function( data, resp) {
                    console.log(data);
                    if (data && data.res.msg) {
                        uploadSuccessDone($('.id-card-03'),data);
                    }
                }
            })(),base64);

        }
    }
} else {
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
            //埋点
            var key = 24005;
            var url = "http://qd.innjia.com:8032/ch?key=" + key;
            $.get(url);

            var list = $(".id-card-03 .uploadFileAddress")[0], string;
            if (list) {
                string = list.value;
            }
            $("input[name='member.memberPhotoInfo.takeIdCard']").val(string);
            save({ "contractId": getArgs().contractId, "takeIdCard": string });
        }
    });
}


function save(data){
    $.ajax({
        url: global.uip.url,
        type: "post",
        data: postdata("4039",data),
        success: function (jsonData) {
            clearInterval(window.timer);
            $('.weui_loading_toast').hide();
            $('.weui_loading_toast .weui_toast_content').html("");
            console.log(jsonData);
        }
    });
}

function postContract(param,jumpUrl) {
    var methodId = "4028";

    //埋点
    var key = 24006;
    var url = "http://qd.innjia.com:8032/ch?key=" + key;
    $.get(url);

    // console.log(param)
    var info = postdata(methodId,param);
    // console.log( "4028param",param )
    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            if (jsonData.code == "0") {
                $('#loadingToast').hide();
                var contractId = $('#datacontainer').data("contractId");

                // showIconDialog("您的房屋租约已确认成功啦<br>现在可以去付租了哦", "确认成功", function (dialog) {
                //     location.href = "index.html?contractId="+getArgs().contractId+"&openId="+getArgs().openId;
                // }, function (dialog) {
                //     location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.innjiabutler.android.chs";
                // });

                window.location.href = "signContract.html?contractId="+getArgs().contractId+"&openId="+getArgs().openId;
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
                $('#loadingToast').hide();
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
                    var positiveIdAddress;
                    if( data.tenantsInfo.positiveIdCard.indexOf("http") >= 0 ) {
                        positiveIdAddress = data.tenantsInfo.positiveIdCard;
                    } else {
                        positiveIdAddress = global.uip.preAddress+data.tenantsInfo.positiveIdCard;
                    }
                    $(".id-card-01 .pic-area .fileView.preview img").attr( 'src',positiveIdAddress );
                    $(".id-card-01 .pic-area").addClass('success');
                    $(".id-card-01 .uploadFileAddress").val( positiveIdAddress );
                    $('input[name="landlord.positiveIdCard"]').val( positiveIdAddress );
                    $('input[name="member.memberPhotoInfo.positiveIdCard"]').val( positiveIdAddress );
                }
                if( data.tenantsInfo.backIdCard ) {
                    var backIdCardAddress;
                    if( data.tenantsInfo.backIdCard.indexOf("http") >= 0 ) {
                        backIdCardAddress = data.tenantsInfo.backIdCard;
                    } else {
                        backIdCardAddress = global.uip.preAddress+data.tenantsInfo.backIdCard;
                    }
                    $(".id-card-02 .pic-area .fileView.preview img").attr( 'src',backIdCardAddress );
                    $(".id-card-02 .pic-area").addClass('success');
                    $(".id-card-02 .uploadFileAddress").val( backIdCardAddress );
                    $('input[name="landlord.backIdCard"]').val( backIdCardAddress );
                    $('input[name="member.memberPhotoInfo.backIdCard"]').val( backIdCardAddress );
                }
                if( data.tenantsInfo.takeIdCard ) {
                    var takeIdCardAddress;
                    if( data.tenantsInfo.takeIdCard.indexOf("http") >= 0 ) {
                        takeIdCardAddress = data.tenantsInfo.takeIdCard;
                    } else {
                        takeIdCardAddress = global.uip.preAddress+data.tenantsInfo.takeIdCard;
                    }
                    $(".id-card-03 .pic-area .fileView.preview img").attr( 'src',takeIdCardAddress );
                    $(".id-card-03 .pic-area").addClass('success');
                    $(".id-card-03 .uploadFileAddress").val( takeIdCardAddress );
                    $('input[name="landlord.takeIdCard"]').val( takeIdCardAddress );
                    $('input[name="member.memberPhotoInfo.takeIdCard"]').val( takeIdCardAddress );
                }
            } else {
                $('#loadingToast').hide();
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

//在APP中打开，隐藏去下载APP按钮
if( isAppFlag ) {
    $('.weui_btn_dialog.btn-close').hide();
    $('.weui_btn_dialog.primary.stay_here').css({"width": "100%"});
}

//判断是否在新版app中打开
function isNewAppOpen() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(
        ( ua.match(/innjiaAppIos\/4\.2\.2/i) >= 'innjiaappios/4.2.2' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.2/i) >= 'innjiaappandroid/4.2.2' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.3/i) >= 'innjiaappios/4.2.3' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.3/i) >= 'innjiaappandroid/4.2.3' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.4/i) >= 'innjiaappios/4.2.4' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.4/i) >= 'innjiaappandroid/4.2.4' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.5/i) >= 'innjiaappios/4.2.5' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.5/i) >= 'innjiaappandroid/4.2.5' )
        ||
        ( ua.match(/innjiaAppIos\/4\.3/i) >= 'innjiaappios/4.3' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.3/i) >= 'innjiaappandroid/4.3' )
    ) {
        return true;
    } else {
        return false;
    }
}

//424新增手持身份证拍照蒙版
function isNewAppOpen424() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(
        ( ua.match(/innjiaAppIos\/4\.2\.4/i) >= 'innjiaappios/4.2.4' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.4/i) >= 'innjiaappandroid/4.2.4' )
        ||
        ( ua.match(/innjiaAppIos\/4\.2\.5/i) >= 'innjiaappios/4.2.5' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.2\.5/i) >= 'innjiaappandroid/4.2.5' )
        ||
        ( ua.match(/innjiaAppIos\/4\.3/i) >= 'innjiaappios/4.3' )
        ||
        ( ua.match(/innjiaAppAndroid\/4\.3/i) >= 'innjiaappandroid/4.3' )
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

    //点击确定合同按钮
    $('.confirm-contract-button').on('click', function(){

        var positiveIdCard = $('input[name="member.memberPhotoInfo.positiveIdCard"]').val();
        var backIdCard = $('input[name="member.memberPhotoInfo.backIdCard"]').val();
        var takeIdCard = $('input[name="member.memberPhotoInfo.takeIdCard"]').val();

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

        $('.confirm-contract-button').css('opacity',1);
        $('.confirm-contract-button a').css('color','#fff');

        var contractId = $("#datacontainer").data("contractId");

        var param = {};

        if (positiveIdCard.indexOf("http://") >= 0) {
            param.positiveIdCard = positiveIdCard.substr(21);
        } else {
            param.positiveIdCard = positiveIdCard;
        }

        if (backIdCard.indexOf("http://") >= 0) {
            param.backIdCard = backIdCard.substr(21);
        } else {
            param.backIdCard = backIdCard;
        }

        if (takeIdCard.indexOf("http://") >= 0) {
            param.takeIdCard = takeIdCard.substr(21);
        } else {
            param.takeIdCard = takeIdCard;
        }

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


function _isIosApp() {
    return window.navigator.userAgent.indexOf('innjiaAppIos') !== -1;
}

