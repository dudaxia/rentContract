
//点击弹框的 确定 按钮，弹框消失
$('.weui_btn_dialog.primary').on('click',function() {
    $(this).parents('.weui_dialog_alert').hide();
});

var openId_wx , refresh_token_wx , token_wx , user_openId;

var loginValidate = {
  getCodeFlag : true,
  init: function() {
    this.bindEvent();
  },
  bindEvent: function(){
    this.clickLoginBtn();
    this.clickGetCode();
  },

  clickLoginBtn: function() {
    var _this = this;

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

    $('.login-btn').on('click',function(){
      // window.location.href = "http://www.baidu.com";
        console.log("phoneNum",$('.phoneNum').val());
       if( !$('.phoneNum').val() ) {
          $('.weui_dialog_bd.prompt_text').html('请输入手机号');
          $('.weui_dialog_alert').show();
          return false;
      }

      if(!myreg.test($(".phoneNum").val())){
          $('.weui_dialog_bd.prompt_text').html('请输入正确手机号');
          $('.weui_dialog_alert').show();
          return false;
      }

      if( $('.phoneCodeNum').val() == '' ) {
          $('.weui_dialog_bd.prompt_text').html('请输入验证码');
          $('.weui_dialog_alert').show();
          return false;

      }

         _this.loginProcess();
        console.log( $('.login-phone-num').val(),$('.login-psw').val() );
        debugger;
    })
  },
  loginProcess: function() {

    var _this = this;
     _this.rest({
        methodId: "1004",
        data: {
            "phone": $('.phoneNum').val(),
            "verifyCode":$('.phoneCodeNum').val(),
            "platform": getPlatform()
        },
        success: function (res) {

            if (res) {
              console.log( "login success!",res );
              if ("0" === res.code) {
                var data = res.res.data;
                user_openId = data.openId;
                _this.bind_thirdPart_1035();
                // window.location.href = "myContract.html?openId="+data.openId;
              } else if ( "410" === res.code ) {
                  _this.registerProcess();
              }
            }
        },
        error: function (res) {
          console.log( res );
        }
      })
  },
  registerProcess: function() {
    var _this = this;
    _this.rest({
        methodId: 1005,
        data: {
            "phone": $('.phoneNum').val(),
            "nickName": $('.phoneNum').val(),
            "platform": getPlatform()
        },
        success: function (res) {
            if (res) {
              console.log( "register success!",res )
              if ("0" === res.code) {
                var data = res.res.data;
                user_openId = data.openId;
                _this.bind_thirdPart_1035();
                // window.location.href = "myContract.html?openId="+data.openId;
              } else {
                  // var tip = res.res.msg;
                  // alert(tip);
              }
            }
        }
      })
  },
  bind_thirdPart_1035: function() {
    var _this = this;
    _this.rest({
        methodId: 1035,
        data: {
            "thirdPartyOpenId": openId_wx,
            "thirdPartyInnJiaAccountType": "WX",
            "refreshToken": refresh_token_wx,
            "accessToken": token_wx,
            "expireDate": getExpireDate(),
            "phone": $('.phoneNum').val(),
            "verifyCode":$('.phoneCodeNum').val(),
            "platform": getPlatform()
        },
        success: function (res) {
          console.log( "1035",res )
          // if ("0" === res.code) {
            var data = res.res.data;
            window.location.href = "myContract.html?openId="+user_openId;
          // }
        }
      });
  },
  clickGetCode: function() {
    this.getCodeBtn = $('.get-code');
    var _this = this;
    _this.getCodeBtn.on('click',function() {
      if( _this.getCodeFlag ) {
        _this.getCodeFlag = false;
        _this.remainingTime();
        _this.getCode();
      }
    });
  },
  remainingTime: function() {
    var _this = this;
    var counting = 60;
    var timer = setInterval(function() {
      _this.getCodeBtn.html("重新获取(" + (counting--) + "S)");
      if( counting < 0 ) {
        _this.getCodeBtn.html("获取验证码");
        _this.getCodeFlag = true;
        clearInterval( timer );
      }
    },1000);
  },
  getCode: function() {
    this.rest({
          methodId: "N003",
          data: {'cellPhone': $(".phoneNum").val() },
          success: function(res) {
             //console.log("getCode",res);
          }
      });
  },
  rest: function(opt){
    var _this = this;
    if(!opt.methodId){
      throw new Error("methodId 不能为空！")
    }
    if(!opt.data){
      opt.data = {}
    }
    $.ajax({
      url: global.uip.url,
      data: postdata(opt.methodId, opt.data),
      type: "post",
      success: opt.success,
      error: opt.error,
      complete: opt.complete
    })
  },
  orderObj: function(obj) {
    let o = {};
    Object.keys(obj).forEach((key) => {
      o[key] = obj[key];
    });
    return o;
  },
  param: function(obj) {
    let arr = [];
    for (let i in obj) {
      arr.push(i + '=' + obj[i]);
    }
    return arr.join('&');
  }
};
loginValidate.init();

//微信配置
var wxProcess = {
  init: function() {
    this.bindEvent();
  },
  bindEvent: function() {
    this.wxGetCode();
  },
  //获取code
  wxGetCode: function() {
    var _this = this;
    var access_code = _this.getParameterByName('code');

    if (access_code == null) {
        var fromurl = window.location.href;//获取授权code的回调地址，获取到code
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+'wx1f01eabc3968e9d6'+'&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
        window.location.href = url;
    } else {
        console.log("access_code",access_code);
        // wxGetPre_auth_code( access_code );
        var codeJson = {code:access_code};
        $.get("/api/Common/GetOpenidAndToken",codeJson,function(data) {
            console.log( data );

            wxOpenId = data.data.openid;

            openId_wx = wxOpenId;
            refresh_token_wx = data.data.refresh_token;
            token_wx = data.data.token;

            if( wxOpenId ) {
              _this.openId_login_1034( wxOpenId );
            }
        })
    }
  },
  //根据第三方的OPENID登录
  openId_login_1034: function(openId) {
    var methodId = "1034";
    var methodParam = {
        thirdPartyOpenId: openId,
        thirdPartyInnJiaAccountType: "WX",
        platform: getPlatform()
    }
    var info = postdata(methodId,methodParam);
    $.ajax({
        url: global.uip.url,
        type: "post",
        data: info,
        success: function (res) {
            console.log("1034",res);
            // res.code = "410"
            //用户openId数据不存在
            if( res.code == "410" ) {
                $('#login-main').show();
                // bind_thirdAccount( openId );
            } else if( res.code == "0" ){
              var data = res.res.data;

              //用户openId已绑定
              window.location.href = "myContract.html?openId="+data.openId;
            }
        }
    });
  },
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
wxProcess.init();


function getPlatform () {
  var ua = window.navigator.userAgent.toLowerCase();
  if( ua.match(/Android/i) == 'android' || ua.match(/Adr/i) == 'adr' ) {
    return 'Android';
  }
  if( ua.match(/iPhone/i) == "iphone" ) {
    return 'IOS';
  }
  return 'H5';
}

function getExpireDate () {
  var nowTime = ( new Date() ).getTime();
  return nowTime+7200;
}
