Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onStartTap:function(){
      // wx.navigateTo({
      //   url: '../post/post'
      // })

      // wx.redirectTo({
      //   url: '../post/post'
      // });

      wx.switchTab({
        url: '../post/post'
      })
  }
})