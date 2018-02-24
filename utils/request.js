var app = getApp();
var douban = app.data.doubanUrl;
var requestUrl = {
    url:{
        inTheatersUrl : douban + '/v2/movie/in_theaters',
        comingSoonUrl : douban + '/v2/movie/coming_soon',
        top250Url : douban + '/v2/movie/top250',
        searchUrl: douban + '/v2/movie/search?q=',
        detailUrl:"https://api.douban.com/v2/movie/subject/",
        commentUrl:"https://m.douban.com/rexxar/api/v2/movie/"
    },
    request:function(params){
        wx.request({
          url: params['url'],
          data: {},
          method: 'GET', 
          header: {
              'Content-Type':'json'
          },
          success: function(res){
              if(params['success']){
                  params['success'](res);
              }
          }
        })
    }
}

function setStar(stars){
    var light = [];
    var half = [];
    for (var i = 0; i < 5; i++) {
      if (i < Math.round(stars / 2)) {
        light.push(1);
      } else {
        light.push(0);
      }
    }
    for (var j = 1; j < 2; j++) {
      if (j > Math.round(stars / 2 - parseInt(stars / 2)) && stars !=0 ) {
        half.push(1);
        light.pop();
      }
    }
    return {
      light: light,
      half: half
    }
}

function setCommentStar(stars){
    var light = [];
    var half = [];
    for (var i = 0; i < 5; i++) {
      if (i < stars) {
        light.push(1);
      } else {
        light.push(0);
      }
    }
    return {
      light: light
    }
}

function covertCastInfo(casts){
    var castsInfo = "";
    for(var i=0;i<casts.length;i++){
        castsInfo = castsInfo + casts[i].name + " / ";
    }
    return castsInfo.substring(0,castsInfo.length-2);
}

module.exports = {
    doubanFn:requestUrl,
    setStar:setStar,
    setCommentStar:setCommentStar,
    covertCastInfo:covertCastInfo
}