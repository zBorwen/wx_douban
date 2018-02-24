var utils = require("../../../utils/request.js");
Page({
  data:{},
  onLoad:function(options){
      var id = options.id;
      var title = options.title;
      this.setData({title:title,id:id})
      var detailUrl = utils.doubanFn.url.detailUrl+id;
      var commentUrl = utils.doubanFn.url.commentUrl+id+"/interests?start=0&count=4";

      this.getMovieData(detailUrl,function(res){
          this.getProcessData(res);
      }.bind(this));

      this.getMovieData(commentUrl,function(res){
          this.getCommentDate(res);
      }.bind(this));

  },
  onReady:function(){
      wx.setNavigationBarTitle({
        title: this.data.title
      })
  },
  getMovieData:function(url,callback){
      var http = utils.doubanFn;
      http.request({
          url:url,
          success:function(res){
              callback && callback(res.data);
          }
      })
  },
  getProcessData(data){
      if(data.directors != null){
         var director = data.directors[0].name;
      }
      var score = data.rating.average.toFixed(1);
      var movie = {
          title:data.title,
          movieImg:data.images?data.images.large:"",
          star: utils.setStar(data.rating.average),
          score:score,
          original:data.original_title,
          director:director,
          genres:data.genres.join(" / "),
          comment:data.comments_count,
          casts:utils.covertCastInfo(data.casts),
          summary:data.summary,
          country:data.countries[0],
          year:data.year
      }
      this.setData({movie:movie})
  },
  getCommentDate:function(data){
      var subject = data.interests;
      var commentData = [];
      var score = {
          value : 0
      }
      for(var i=0;i<subject.length;i++){
          //subject[i].rating?subject[i].rating.value:subject[i].rating = score;
          var movie = {
              avatar:subject[i].user.avatar,
              name:subject[i].user.name,
              date:subject[i].create_time,
              comment:subject[i].comment,
              star:utils.setCommentStar(subject[i].rating?subject[i].rating.value:0)
          }
          commentData.push(movie);
      }
      this.setData({commentData:commentData});
  },
  moreCommentTap:function(event){
      wx.navigateTo({
        url: '../more-comment/more-comment?title='+this.data.title+"&id="+this.data.id
      })
  }
})