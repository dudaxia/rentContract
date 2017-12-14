// openId = "6b7bfb6869d43d188de01eb0327da5ab";
// contractId = "d6f6608a-4c3e-4e2c-b9f2-8d9c349afe17";
var contractId;

(function () {
    //埋点
    var key = 24001;
    var url = "http://qd.innjia.com:8032/ch?key=" + key;
    $.get(url);

    contractId = getArgs().contractId;
    $("#datacontainer").data("contractId", contractId);
    loadContractInfo(contractId);
    bindSel('contactRelationship', BasicData.relationType);
    $("#btnContractInputNext").on('click', function(){
        var param = {};
        var mobileReg = /^1\d{10}$/;
        if( !mobileReg.test( $('input[name=tenantBankMobile]').val() ) ) {
            $('.weui_dialog_alert').find('.weui_dialog_title').text('银行预留手机号格式不正确！');
            $('.weui_dialog_alert').show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
                $('.weui_dialog_alert').hide();
            });
            return false;
        }
        if( !mobileReg.test( $('input[name=contactMobile]').val() ) ) {
            $('.weui_dialog_alert').find('.weui_dialog_title').text('紧急联系人手机号格式不正确！');
            $('.weui_dialog_alert').show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
                $('.weui_dialog_alert').hide();
            });
            return false;
        }
        param.bankAccount = $('input[name=backAccount]').val();
        param.tenantBankMobile = $('input[name=tenantBankMobile]').val();
        param.contactRelationship = $('select[name=contactRelationship]').val();
        param.contactName = $('input[name=contactName]').val();
        param.contactMobile = $('input[name=contactMobile]').val();
        param.contractId = contractId;
        // param.openId = "fa571d2f033131ef86c4dbbbbb40ed8b";
        param.openId = getArgs().openId;
        postContract(param);
    });

    $('.back-button').on('click', function () {
        history.back();
    });

}).call(this);

function loadContractInfo(){
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
                var data = jsonData.res.data;
                $("#backAccount").val(data.tenantsInfo.bankAccount);
                $("#tenantBankMobile").val(data.tenantsInfo.tenantBankMobile);
                $("#contactRelationship").val(data.tenantsInfo.contactRelationship);
                $("#contactName").val(data.tenantsInfo.contactName);
                $("#tenantName").text(data.tenantsInfo.name);
                $("#contactMobile").val(data.tenantsInfo.contactMobile);
                // $("input[name=idCard]").val(data.tenantsInfo.idCard);
            } else {
                alert(jsonData.code + ": " + jsonData.res.msg);
            }
        }
    });
}

function postContract(param)
{
    var dialog = $('.weui_dialog_alert');
    if ("" == $("#backAccount").val()) {
        dialog.find('.weui_dialog_title').text('银行卡号必填');
        dialog.show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
            $('.weui_dialog_alert').hide();
        });
        return false;
    }
    if ($("#tenantBankMobile").val().length != 11) {
        dialog.find('.weui_dialog_title').text('银行预留手机号未填写或格式错误');
        dialog.show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
            $('.weui_dialog_alert').hide();
        });
        return false;
    }
    if ("" == $("#contactRelationship").val()) {
        dialog.find('.weui_dialog_title').text('紧急联系人关系必填');
        dialog.show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
            $('.weui_dialog_alert').hide();
        });
        return false;
    }
    if ("" == $("#contactName").val()) {
        dialog.find('.weui_dialog_title').text('紧急联系人姓名必填');
        dialog.show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
            $('.weui_dialog_alert').hide();
        });
        return false;
    }
    if ($("#contactMobile").val().length != 11) {
        dialog.find('.weui_dialog_title').text('紧急联系人手机号未填写或格式错误');
        dialog.show().find('.weui_btn_dialog.primary').off('click').on('click', function () {
            $('.weui_dialog_alert').hide();
        });
        return false;
    }

    var methodId = "4028";

    var info = postdata(methodId,param);

    $.ajax({
            url: global.uip.url,
            type: "post",
            data: info,
            success: function (jsonData) {
                if (jsonData.code == "0") {
                   var contractId = $('#datacontainer').data("contractId");
                    console.log(contractId);
                    window.location.href = "idPhoto.html?contractId=" + contractId + "&openId=" + getArgs().openId;

                } else {
                    alert(jsonData.code + ": " + jsonData.res.msg);
                }
            }
        });
}

function bindSel(id, data) {
    var html = "";
    if ($("#" + id + "[multiple]").length < 1) {
        html += "<option value=\"\"></option>";
    }
    $.each(data, function (i, n) {
        html += "<option value=\"" + n.value + "\">" + n.text + "</option>";
    });
    $("#" + id).empty().append(html);
}
