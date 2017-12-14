// openId = "6b7bfb6869d43d188de01eb0327da5ab";
// contractId = "d6f6608a-4c3e-4e2c-b9f2-8d9c349afe17";

(function () {

    var userId = getArgs().userId;
    // var methodId = "4031";
    var methodId = "1026";
    var methodParam = {originalId: userId};

    var info = postdata(methodId,methodParam);

     $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
            if (jsonData && jsonData.code == "0" && jsonData.res && jsonData.res.data) {
                var contractId = jsonData.res.data.lastNeedPay.originalId;
                loadContractInfo(contractId);
            }
        }
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
            if (jsonData.code == "0") {
                var data = jsonData.res.data;
                $("span[name=contractNo]").html(data.contractNo);
                $("span[name=tenantsName]").html(data.tenantsName);
                $("span[name=idCard]").html(data.tenantsInfo.idCard);
                $("span[name=tenantsPhone]").html(data.tenantsPhone);

                var landlordHouse = data.landlordHouse;
                $("span[name=lcHouseName]").html(landlordHouse.name);
                // var addr = landlordHouse.roomProvince + "-" + landlordHouse.roomCity + "-" + landlordHouse.roomCounty + "-" + landlordHouse.areaName + "-" + landlordHouse.roomAddress;
                var addr = landlordHouse.roomCity + "-" + landlordHouse.roomCounty + "-" + landlordHouse.areaName + "-" + landlordHouse.roomAddress;
                $("span[name=lcHouseAddr]").html(addr);

                $("span[name=leaseStartTime]").html(data.leaseStartTime.split(' ')[0]);
                $("span[name=leaseEndTime]").html(data.leaseEndTime.split(' ')[0]);

                $("span[name=noFixationStartTime]").html(data.noFixationStartTime.split(' ')[0]);
                $("span[name=noFixationEndTime]").html(data.noFixationEndTime.split(' ')[0]);

                $("span[name=payDay]").html(data.payDay);
                $("span[name=rent]").html(data.rent);

                $('#contractNext').attr("href", "tenantInfo.html?contractId=" + contractId)

                $('.next-step').on('click', function () {
                    location.href = "tenantInfo.html?contractId=" + contractId + "&openId=" + data.tenantsInfo.openId;
                });
            } else {
                console.log("未获取到合同信息, 合同编号:" + contractId);
            }
        }
    });
}