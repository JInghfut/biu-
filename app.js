//app.js
App({
  onLaunch: function () {
    
  },
  globalData: {
    baseUrl:'https://biu.playonwechat.com'
  },
  showLoading:function (title) {
      if(!title){
          title='正在加载图片中';
      }
      wx.showLoading({
          title:title
      });
  },
  hideLoading:function () {
      wx.hideLoading();
  }
})