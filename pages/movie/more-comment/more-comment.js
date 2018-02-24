var utils = require("../../../utils/request.js");
Page({
  data:{
      total:0,
      mark:true
  },
  onLoad:function(options){
      var title = options.title;
      var id = options.id;
      this.setData({title:title,id:id});
      var commentUrl = utils.doubanFn.url.commentUrl;
      utils.doubanFn.request({
          url:commentUrl+id+"/interests?start=0&count=20",
          success:function(res){
              this.getCommentData(res.data);
          }.bind(this)
      })
  },
  onReady:function(){
      wx.setNavigationBarTitle({
        title: this.data.title
      })
  },
  getCommentData:function(data){
      var subject = data.interests;
      var commentData = [];
      for(var i=0;i<subject.length;i++){
          var movie = {
              avatar:subject[i].user.avatar,
              name:subject[i].user.name,
              date:subject[i].create_time,
              comment:subject[i].comment,
              star:utils.setCommentStar(subject[i].rating?subject[i].rating.value:0)
          }
          commentData.push(movie);
      }
      var totalComment = [];
      if(this.data.mark){
          totalComment = commentData;
          this.data.mark = false;
      }else{
          totalComment = this.data.commentData.concat(commentData);
      }
      this.data.total += 20;
      this.setData({commentData:totalComment});
      wx.hideNavigationBarLoading();
  },
  onScrollLowerTap:function(){
       var http = utils.doubanFn;
       var nextUrl = http.url.commentUrl;
       http.request({
          url:nextUrl+this.data.id+"/interests?start="+this.data.total+"&count=20",
          success:function(res){
              this.getCommentData(res.data);
          }.bind(this)
       })
       wx.showNavigationBarLoading();
  },
  onReachBottom: function() {
      var http = utils.doubanFn;
      var nextUrl = http.url.commentUrl;
      http.request({
         url:nextUrl+this.data.id+"/interests?start="+this.data.total+"&count=20",
         success:function(res){
             this.getCommentData(res.data);
         }.bind(this)
      })
      wx.showNavigationBarLoading();
  }
})