(function () {
    var contractId = getArgs().contractId;

    loadContractInfo(contractId);

}).call(this);

function dateFmt (start, end) {
    var splitDate = function (adate) {
        var datepart = adate.split(" ")[0].split("-");
        return { "y":datepart[0], "m":datepart[1]*1, "d":datepart[2]*1 };
    }
    var s = splitDate(start), e = splitDate(end);
    return s.y+"年"+s.m+"月"+s.d+"日"+"至"+e.y+"年"+e.m+"月"+e.d+"日";
}

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
            if (jsonData.code == "0") {
                var data = jsonData.res.data;
                var tenantsInfoAddress = (data.landlordHouse.roomProvince || "")
                     + (data.landlordHouse.areaName || "")
                     + (data.landlordHouse.roomAddress || "")
                     + (data.landlordHouse.roomCode || "");

$('span[name=landlordHouse_companyName]').text(data.landlordHouse.companyName);
$('span[name=landlordHouse_companyAddress]').text(data.landlordHouse.companyAddress);
$('span[name=tenantsInfo_name]').text(data.tenantsInfo.name);
$('span[name=tenantsInfo_idCard]').text(data.tenantsInfo.idCard);
$('span[name=tenantsInfo_address]').text(tenantsInfoAddress);
$('span[name=tenantsInfo_mobile]').text(data.tenantsInfo.mobile);
$('span[name=tenantsInfo_fulladdress]').text(data.tenantsInfo.fulladdress);
$('span[name=leaseTime]').text(dateFmt(data.leaseStartTime, data.leaseStartTime));
$('span[name=fixationTime]').text(dateFmt(data.fixationStartTime, data.fixationEndTime));
$('span[name=noFixationTime]').text(dateFmt(data.noFixationStartTime, data.noFixationEndTime));
$('span[name=leaseTime]').text(dateFmt(data.leaseStartTime, data.leaseStartTime));
$('span[name=rent]').text(data.rent);
$('span[name=deposit]').text(data.deposit);
$('span[name=tenantsInfo_contactName]').text(data.tenantsInfo.contactName);
$('span[name=tenantsInfo_contactRelationship]').text(data.tenantsInfo.contactRelationship);
$('span[name=tenantsInfo_bankAccount]').text(data.tenantsInfo.bankAccount);
$('p[name=supplement]').text( html_encode(data.supplement) );
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
    return s;
}
