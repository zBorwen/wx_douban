var utils = require("../../utils/request.js");
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchShow: false,
    historyShow:false
  },
  onLoad: function (options) {
    // this.getMovieData('inTheatersUrl', 'inTheaters', '正在热映');
    // this.getMovieData('comingSoonUrl', 'comingSoon', '即将上映');
    // this.getMovieData('top250Url', 'top250', 'top250');

    wx.request({
      url: 'http://api.douban.com/v2/movie/top250?start=0&count=6',
      method: 'GET',
      success: function (res) {
        console.log(res)
      }
    })
  },
  getMovieData: function (url, setKey, categroyTitle) {
    var http = utils.doubanFn;
    http.request({
      url: http.url[url] + '?start=0&count=6',
      success: function (res) {
        console.log(res)
        this.getProcessData(res.data, setKey, categroyTitle);
      }.bind(this)
    })
  },
  getProcessData: function (movieData, setKey, categroyTitle) {
    var movies = [];
    var doubanData = movieData.subjects;
    for (var i = 0; i < doubanData.length; i++) {
      var temp = {
        title: doubanData[i].title,
        coverImg: doubanData[i].images.large,
        average: doubanData[i].rating.average,
        movieId:doubanData[i].id,
        star: utils.setStar(doubanData[i].rating.average)
      }
      movies.push(temp);
    }
    var keyData = {};
    keyData[setKey] = {
      movies: movies,
      categroyTitle: categroyTitle
    }
    this.setData(keyData);
    /*
        {
          inTheaters:{
             movies:movies  
          }
        }
    
    */
  },
  onCancel: function () {
    this.setData({
      containerShow: true,
      searchShow: false,
      historyShow:false
    })
  },
  onFocus:function(){
    this.setData({
       containerShow:false,
       searchShow:true,
       historyShow:true
    });

    var historyRecord = wx.getStorageSync('historyItem') || [];
    // for(var i=0;i<historyRecord.length;i++){
    //    for(var j=historyRecord.length;j>0;j--){
    //       if(historyRecord[i]==historyRecord[j] && i!=j){
    //           historyRecord.splice(i,1);
    //       }
    //    }
    // }

    // var newArr = [];
    // for(var i=0;i<historyRecord.length;i++){
    //     if(newArr.indexOf(historyRecord[i]) == -1){
    //         newArr.push(historyRecord[i]);
    //     }
    // }

    //返回item本身所对应的索引和indexOf检索的是否相同 达到了去重的目的
    //arr= [1,1,2];
    historyRecord = historyRecord.filter(function(item,index,array){
        return array.indexOf(item) === index;
    });

    this.setData({
       historyRecord:historyRecord
    });
  },
  onConfirm: function (event) {
    var text = event.detail.value;
    var http = utils.doubanFn;
    var url = http.url['searchUrl'] + text;
    http.request({
      url: url,
      success: function (res) {
        this.getProcessData(res.data, 'searchResult', '');
        this.setData({historyShow:false})
      }.bind(this)
    })

    //设置到缓存 缓存是一个数组 searchRecord[]
    var historyRecord = wx.getStorageSync('historyItem') || [];
    //判断是不是空
    if(text)historyRecord.push(text);
    wx.setStorageSync('historyItem', historyRecord);
  },
  onMoreTap:function(event){
      var categroy = event.currentTarget.dataset.categroy;
      wx.navigateTo({
        url: 'more/more?categroy='+categroy
      })
  },
  onDetailTap:function(event){
      var id = event.currentTarget.dataset.id;
      var title = event.currentTarget.dataset.title;
      wx.navigateTo({
        url: 'detail/detail?id='+id +"&title="+title
      })
  },
  onItemTap:function(event){
      var text = event.currentTarget.dataset.item;
      var http = utils.doubanFn;
      var url = http.url['searchUrl'] + text;
      http.request({
        url: url,
        success: function (res) {
          this.getProcessData(res.data, 'searchResult', '');
          this.setData({historyShow:false})
        }.bind(this)
      })
  }
})