var postBase = require('../../data/postDetail.js');
Page({
  data:{
      
  },
  onLoad:function(options){
      var postData = postBase.postData;
      this.setData({postData:postData});
  },
  onPostTap:function(event){
      var postId = event.currentTarget.dataset.postid;
      var title = event.currentTarget.dataset.title;
      wx.navigateTo({
        url: 'post-detail/post-detail?id='+postId + '&title=' + title
      });
  },
  onDetailTap:function(event){
      var id = event.currentTarget.dataset.postid;
      var title= event.currentTarget.dataset.title;
      wx.navigateTo({
        url: 'post-detail/post-detail?id='+id+'&title='+title
      })
  },
  onSwiperTap:function(event){
      var id = event.target.dataset.postid;
      var title= event.target.dataset.title;
      wx.navigateTo({
        url: 'post-detail/post-detail?id='+id+'&title='+title
      })
  }
})