var utils = require('../../../utils/request.js');
Page({
  data: {
    total: 0,
    movies:[]
  },
  onLoad: function (options) {
    var categroy = options.categroy;
    var url = this.getMoreType(categroy);
    var http = utils.doubanFn;
    http.request({
      url: http.url[url],
      success: function (res) {
        this.getProcessData(res.data);
      }.bind(this)
    })
    this.setData({
      categroy: categroy,
      url: url
    });
  },
  getMoreType: function (param) {
    if (param == '正在热映') return 'inTheatersUrl';
    if (param == '即将上映') return 'comingSoonUrl';
    if (param == 'top250') return 'top250Url';
  },
  getProcessData: function (movieData) {
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
    var totalMovie = [];
    totalMovie = this.data.movies.concat(movies);
    this.setData({ movies: totalMovie });
    this.data.total += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.categroy
    })
  },
  onLowerTap: function (event) {
    var http = utils.doubanFn;
    http.request({
      url: http.url[this.data.url] + '?start='+this.data.total+'&count=20',
      success: function (res) {
        this.getProcessData(res.data);
      }.bind(this)
    })
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function () {
    this.data.movies = [];
    this.data.total = 0;
    var http = utils.doubanFn;
    http.request({
      url: http.url[this.data.url] + '?start=0&count=20',
      success: function (res) {
        this.getProcessData(res.data);
      }.bind(this)
    })
    wx.showNavigationBarLoading();
  },
  onDetailTap:function(event){
      var id = event.currentTarget.dataset.id;
      var title = event.currentTarget.dataset.title;
      wx.navigateTo({
        url: '../detail/detail?id='+id+"&title="+title
      })
  }
})