// 百度地图API功能
if( isNewAppOpen() ) {
  //App传入lng,lat

} else {
  var map = new BMap.Map("allmap");    // 创建Map实例
  //map.centerAndZoom(new BMap.Point(121.49, 31.23), 15);  // 初始化地图,设置中心点坐标和地图级别
  var geolocation = new BMap.Geolocation();
  var lng,lat;
  geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      lng = r.point.lng || '9999';
      lat = r.point.lat || '9999';
      var myPoint = {
        lng: lng,
        lat: lat
      };
      console.log( 'current Point',lng,lat );
      window.teantsLocation = '' + lng + ',' + lat;
    }
  });
}

  //     console.log( 'window.teantsLocation',window.teantsLocation );
  //     var point = new BMap.Point(lng,lat);
  //     var circle = new BMap.Circle(point,1000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});

      //搜索结果
      // var local =  new BMap.LocalSearch(map, {
      //   pageCapacity:20,
      //   onSearchComplete:function(res){
        //console.log( res.getCurrentNumPois() );
        //获取搜索的结果
        // var resArr = [];
        // for( var i=0; i<res.getCurrentNumPois(); i++ ){
        //   //console.log( res.getPoi(i) );
        //   var info = {
        //     title: res.getPoi(i).title,
        //     address: res.getPoi(i).address,
        //     point: {
        //       lat: res.getPoi(i).point.lat,
        //       lng: res.getPoi(i).point.lng
        //     }
        //   };
        //   resArr.push( info );
        // }
        //获取结果中距离自己最近的
        // var latestPoi = getLatestInfo( resArr,myPoint );
        // console.log( 'latestPoi',latestPoi );
        // $('input[name="member.memberInfo.position"]').val( JSON.stringify( latestPoi.point ));
        // $('input[name="member.memberInfo.aparentmentName"]').val( latestPoi.title );
        // $('input[name="member.memberInfo.aparentmentAddress"]').val( latestPoi.address );
        // window.teantsLocation = '' + latestPoi.point.lng + ',' + latestPoi.point.lat;
  //     }
  //     });
  //     local.searchNearby('公寓',point,1000);
  //   }
  //   else {
  //     alert('failed'+this.getStatus());
  //   }
  // },{enableHighAccuracy: true})

  // function getLatestInfo( param,myPoint ) {
    //console.log( param,myPoint );
    // var pointA = new BMap.Point( myPoint.lng,myPoint.lat );
    // var pointB,distanceArr = [];
    // for( var i=0; i<param.length; i++ ) {
    //   pointB = new BMap.Point( param[i].point.lng,param[i].point.lat );
    //   var distance = map.getDistance(pointA,pointB).toFixed(2);
    //   var info = {
    //     title: param[i].title,
    //     address:  param[i].address,
    //     distance: distance,
    //     point: {
    //       lat: param[i].point.lat,
    //       lng: param[i].point.lng
    //     }
    //   }
    //   distanceArr.push( info )
    // }
    //按照距离进行排序，返回最近点
    // distanceArr.sort( compare("distance") );
    //console.log(distanceArr);
  //   return distanceArr[0];
  // }
//   function compare(prop) {
//     return function (obj1, obj2) {
//         var val1 = parseInt( obj1[prop] );
//         var val2 = parseInt( obj2[prop] );
//         if (val1 < val2) {
//             return -1;
//         } else if (val1 > val2) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }
//   }
// }

// function isNewAppOpen () {
//     // var ua = window.navigator.userAgent;
//     var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27/innjiaAppIos/4.2.2";
//     console.log( "000ua",ua );
//     var index = ( ua.indexOf("innjiaAppIos/4.2.2") == -1 ? "undefined" : ua.indexOf("innjiaAppIos/4.2.2") )
//       || ( ua.indexOf("innjiaAppIos/4.2.3") == -1 ? "undefined" : ua.indexOf("innjiaAppIos/4.2.3") )
//       || ( ua.indexOf("innjiaAppAndroid/4.2.2") == -1 ? "undefined" : ua.indexOf("innjiaAppAndroid/4.2.2") )
//       || ( ua.indexOf("innjiaAppAndroid/4.2.3") == -1 ? "undefined" : ua.indexOf("innjiaAppAndroid/4.2.3") );
//     var iosNum = ua.substring( index ).split( "/" )[1].split(".")[2];
//     var androidNum = ua.substring( index ).split( "/" )[1].split(".")[2];
//     console.log( "000index",index );
//     console.log( "000iosNum",iosNum );
//     console.log( "000androidNum",androidNum );
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

//判断是否在app中打开
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
