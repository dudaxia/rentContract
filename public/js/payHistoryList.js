( function($){
    //set导航条颜色toApp
    var barStyleParams = {};
    barStyleParams.barFontColor = "1";//0:字体颜色为黑色     1：字体颜色为白色
    util.setBarStyle(barStyleParams);

    //报错提示
    if (!getArgs().openId && !getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
        return false;
    }
    if ('null' == getArgs().openId || 'null' == getArgs().userId) {
        $('.weui_toast_content').text("玩脱了，出错了");
        return false;
    }

    $('.back-button').on('click', function () {
        history.back();
    })

    var historyDetail = {
        init: function(){
            this.bindEvent();
        },
        bindEvent: function(){
            this.getinfo();
            this.checkDetail();
        },
        getinfo: function() {
            var _this = this;

            var methodId = "4031";
            var methodParam = {};
            methodParam.openId = getArgs().openId;
            var info = postdata(methodId,methodParam);

            $.ajax({
                url: global.uip.url,
                type: "post",
                data: info,
                success: function (jsonData) {
                    debugger;
                    console.log(jsonData);
                    if( jsonData.code == '0' ) {
                        $('#loadingToast').hide();

                        var data = jsonData.res.data;
                        var domStr = '';
                        for( var i=0; i<data.rows.length; i++ ) {
                            var addressStr = data.rows[i].roomProvince+data.rows[i].roomCity+data.rows[i].roomCounty+data.rows[i].roomAddress;
                            domStr += '<div class="main-info" data-contractId='+ data.rows[i].contractId +'>'
                                    +  '<div class="rent-info">'
                                    +      '<p class="history-rent-date"><span name="lease-date">'+ data.rows[i].leaseDate +'</span></p>'
                                    +      '<p class="history-address">'+ addressStr +'</p>'
                                    +  '</div>'
                                    +  '<img class="history-arrow" src="../../../public/img/arrow_right.png">'
                                    +'</div>';
                        }
                        $('.main-status').html(domStr);
                    } else { }
                },
                error: function () {
                    $('#loadingToast').hide();
                    $('.weui_toast_content').text("哎呀，出错了");
                }
            });
        },
        checkDetail: function() {
            $('.main-status').on( 'click','.main-info', function(){
                var contractId = $(this).data('contractid');
                window.location.href = "payHistoryDetail.html?contractId=" + contractId + "&openId=" + getArgs().openId;
            } )
        }
    };
    historyDetail.init();
} )( jQuery );

