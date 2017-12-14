
var contractId = getArgs().contractId;
loadContractInfo(contractId);

//isHomePageEnter == 1 从app首页进入
var isHomePageEnter = getArgs().appHomePage;

if( isHomePageEnter == 1 ) {
    $('.back-button').on('click',function() {
        location.href = "innjia-js://closeView";
    });
} else {
    $('.back-button').on('click',function() {
        history.back();
    });
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
                if( data.contractExit ) {
                    $("#initiateDate").html(data.contractExit.initiateDate);
                    $("#exitDate").html(data.contractExit.exitDate );
                }
            } else {
                alert(jsonData.code + ": " + jsonData.res.msg);
            }
        }
    });
}
function Returnparticipat(Return){
    var methodId = "1050";
    var methodParam = {};
    methodParam.statusName = Return;
    methodParam.contractId = contractId;
    methodParam.initiatorOpenId = getArgs().openId;
    methodParam.exitDate = $("#exitDate").html();
    var info = postdata(methodId,methodParam);
    // console.log(info);
    // console.log(methodParam);
     $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (jsonData) {
             // console.log( "1050",jsonData )
             window.location.href = "myContract.html?contractId="+contractId+"&openId="+getArgs().openId;
        }
    });
}
$('#noagree').on('click', function () {
    Returnparticipat('OrderRepayment');
});
$('#agree').on('click', function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var dt = d.getDate();

    var dateStr =  year + "-" + "0"+month + "-" + dt + " 00:00:00";
    if( dateStr == $("#exitDate").html() ) {
        console.log( "已退租" )
        Returnparticipat('OrderOutOver');
    } else {
        console.log( "退租中" )
        Returnparticipat('OrderPreOutApply');
    }
});


