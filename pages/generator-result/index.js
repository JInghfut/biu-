//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      content:{

      },
      btnVideoPlayHide:false
  },
  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: options.title
      })
console.log(options)
      this.setData({
          content:{
              id:options.bi_id,
              title: options.title,
              url:decodeURIComponent(options.url),
              bi_cate_type:options.bi_cate_type,
              screenshot: options.screenshot ? decodeURIComponent(options.screenshot):''
          }

      })
      this.videoContext = wx.createVideoContext('resVideo');

  },
    playVideo:function () {
        this.setData({
            btnVideoPlayHide:true
        }, function() {
            // this is setData callback
        })
        this.videoContext.play();
    },
    previewImg(e){
      var src = e.currentTarget.dataset.src;
      wx.previewImage({
        src:src,
        urls: [src]
      })
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/user?id=123',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
  toSearchPage: function (e) {
      wx.navigateTo({
          url: '../search/index'
      });
  }
})
