var postBase = require('../../../data/postDetail.js');
var app = getApp();
Page({
  data:{
      isPlaying:false
  },
  onLoad:function(options){
      var postId = options.id;
      var title = options.title;
      var postData = postBase.postData[postId];
      this.setData({
        postData:postData,
        title:title,
        postId:postId
      });

      // var post_collected = {
      //     0:true,
      //     1:false
      // }
      //拿一次缓存
      var isCollected = wx.getStorageSync('post_collected');
      if(isCollected){
          var collected = isCollected[this.data.postId];
          this.setData({collected:collected});
      }else{
          var isCollected = {};
          var collected = false;
          wx.setStorageSync('post_collected', isCollected);
      }

      if(app.data.g_isPlaying && app.data.g_currentId == postId){
          this.setData({isPlaying:true});
      }

      this.onPageMusic();
  },
  onReady:function(){
      //页面渲染
      wx.setNavigationBarTitle({
        title: this.data.title
      });

      //获取audio
      //this.audioCtx = wx.createAudioContext('myAudio');
  },
  onCollectTap:function(){
      this.getPostStroageSync();
      //this.getPostStorage();
  },
  getPostStroageSync:function(){
      //首先拿到所有的缓存
      var isCollected = wx.getStorageSync('post_collected');
      //拿到单个的文章
      var collected = isCollected[this.data.postId];
      //拿到相对应的文章是否被收藏
      //收藏变成未收藏 为收藏变成收藏
      collected = !collected;
      //更新缓存对象
      isCollected[this.data.postId] = collected;
      //set 更新之后的缓存
      wx.setStorageSync('post_collected', isCollected);
      //设置collected
      this.setData({collected:collected});
      //this.showToast(collected);
      this.showModal(collected,isCollected);

  },
  getPostStorage:function(){
      wx.getStorage({
        key: 'post_collected',
        success: function(res){
            var isCollected = res.data;
            var collected = isCollected[this.data.postId];
            collected = !collected;
            isCollected[this.data.postId] = collected;
            wx.setStorage({
              key: 'post_collected',
              data: isCollected
            })
            this.setData({collected:collected});
        }.bind(this)
      })
  },
  showToast:function(collected){
      //判断collected 是否被收藏 收藏 / 取消
      //拿到缓存
      wx.showToast({
          title:collected?'收藏':'取消',
          icon:'loading',
          duration:10000,
          mask:true
      });
      //setTimeout(function(){
      //   wx.hideToast();
      //},2000)
  },
  showModal:function(collected,isCollected){
      wx.showModal({
          title:collected?'确认收藏':'取消收藏',
          icon:'success',
          showCancel:true,
          cancelText:'取消',
          cancelColor:'#333',
          confirmText:'确认',
          confirmColor:'green',
          success:function(res){
              if(!res.confirm){
                  collected = !collected;
                  isCollected[this.data.postId] = collected;
                  wx.setStorageSync('post_collected', isCollected);
                  this.setData({collected:collected});
              }
          }.bind(this)
      })
  },
  onMusicTap:function(){
      /*
         1.进入文章点击播放 出去在进来 播放状态应该是保持才对
         2.怎么样处理? 通过全局属性的控制播放状态
         3.通过音乐的监听控制全局 同样的去改变单独文章里的音乐播放状态
      */
      var isPlaying = this.data.isPlaying;
      var musicData = postBase.postData[this.data.postId].music;
      if(isPlaying){
         wx.pauseBackgroundAudio();
         app.data.g_isPlaying = false;
      }else{
         wx.playBackgroundAudio({
            dataUrl: musicData.src,
            title:musicData.title,
            coverImg:musicData.poster
         });
         app.data.g_isPlaying = true;
      }
      isPlaying = !isPlaying;
      this.setData({isPlaying:isPlaying});


      //if(isPlaying){
      //    this.audioCtx.pause();
      //}else{
      //    this.audioCtx.play();
      //}
      //正在播放变成暂停 暂停变成播放
      //isPlaying = !isPlaying;
      //this.setData({isPlaying:isPlaying});
  },
  onPageMusic:function(){
      //音乐的播放和暂停的监听
      wx.onBackgroundAudioPlay(function() {
         this.setData({isPlaying:true});
         app.data.g_isPlaying = true;
         app.data.g_currentId = this.data.postId;
      }.bind(this));

      wx.onBackgroundAudioPause(function() {
         this.setData({isPlaying:false});
         app.data.g_isPlaying = false;
         app.data.g_currentId = null;
      }.bind(this));

      wx.onBackgroundAudioStop(function() {
         this.setData({isPlaying:false});
         app.data.g_isPlaying = false;
         app.data.g_currentId = null;
      }.bind(this));

  },
  onShareTap:function(){
      wx.showActionSheet({
          itemList:[
              'qq',
              '朋友圈',
              '微博'
          ],
          success:function(res){
              console.log(res);
          }
      })
      //wx.clearStorageSync();
  },
  onShareAppMessage: function() {
     return {
        title: this.data.title,
        path: '/pages/post/post-detail/post-detail'
     }
  }
})