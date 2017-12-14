(function($) {
  'use strict';

  function _isAndroidApp() {
    return window.navigator.userAgent.indexOf('innjiaAppAndroid') !== -1;
  }

  function _isIosApp() {
    return window.navigator.userAgent.indexOf('innjiaAppIos') !== -1;
  }

  function toZhiFu(data) {
    if (_isAndroidApp()) {
      if (data) {
        androidAndjs.toZhiFu(JSON.stringify(data));
      } else {
        androidAndjs.toZhiFu();
      }
    } else if (_isIosApp()) {
      window.webkit.messageHandlers.toZhiFu.postMessage(data);
    }
  }
  function getLocationMessage() {
    if (_isAndroidApp()) {
      if ("function" == typeof androidAndjs.getLocationMessage)
        androidAndjs.getLocationMessage();
    } else if (_isIosApp()) {
      if ("function" == typeof window.webkit.messageHandlers.getLocationMessage)
      window.webkit.messageHandlers.getLocationMessage.postMessage("");
    }
  }
  function toDaiFu(data) {
    if (_isAndroidApp()) {
      if (data) {
        androidAndjs.toDaiFu(JSON.stringify(data));
      } else {
        androidAndjs.toDaiFu();
      }
    } else if (_isIosApp()) {
      window.webkit.messageHandlers.toDaiFu.postMessage(data);
    }
  }

  function setBackToPrePage( str ) {
    if (_isAndroidApp()) {
      if ("function" == typeof androidAndjs.setBackToPrePage)
        androidAndjs.setBackToPrePage(str);
    } else if (_isIosApp()) {

    }
  }


  function historyBack() {
    window.history.back();
  }

  function setBarStyle() {

  }

  function backToApp() {
    if (_isAndroidApp()) {
      androidAndjs.backToApp();
    } else if (_isIosApp()) {
      try {
        window.webkit.messageHandlers.backToApp.postMessage('');
      } catch (e) {
        historyBack();
      }
    } else {
      historyBack();
    }
  }

  function getPhotoWithFace() {
   if (_isAndroidApp()) {
      if (data) {
        androidAndjs.getPhotoWithFace("");
      } else {
        androidAndjs.getPhotoWithFace("");
      }
    } else if (_isIosApp()) {
      window.webkit.messageHandlers.getPhotoWithFace.postMessage("");
    }
  }

  var util = {
    toZhiFu: toZhiFu,
    setBarStyle: setBarStyle,
    toDaiFu: toDaiFu,
    backToApp: backToApp,
    historyBack: historyBack,
    getLocationMessage: getLocationMessage,
    getPhotoWithFace: getPhotoWithFace,
    setBackToPrePage:setBackToPrePage
  };

  window.util = util;
})(jQuery);
