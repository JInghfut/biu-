//index.js
//获取应用实例
const app = getApp()
//form_type:1   // 1照片，2姓氏、头像、背景，3姓名
Page({
  data: {
      content_items:[],
      url:'/list/index?type={type}&page={page}&per-page=10',
      scrollTop : 0,
      scrollHeight:0,
      type:'',
      nextPage:0,
      isLoading:false
  },
  loadList:function (page) {
      var that = this;
      app.showLoading();
      var url = this.data.url.replace(/\{type\}/,that.data.type);
      url = url.replace(/\{page\}/,page);
      url = app.globalData.baseUrl+url;
      wx.request({
          url: url,
          header: {
              'content-type': 'application/json' // 默认值
          },
          success: function(res) {
              var result = res.data;
              if(result.status ==1){
                  that.data.nextPage = result.data.nextPage;
                  var content_items = that.data.content_items;
                  console.log("list:", content_items)
                  for(var i=0;i < result.data.list.length;i++){
                      content_items.push(result.data.list[i]);
                  }
                  that.setData({
                      content_items:content_items
                  });
              }

          },
          complete: function(res){
            app.hideLoading();
          }
      });
  },
  onLoad: function (options) {
     var that = this;
      wx.setNavigationBarTitle({
          title: options.title
      })
      wx.getSystemInfo({
          success:function(res){
              that.setData({
                  scrollHeight:res.windowHeight
              });
          }
      });
     that.data.type = options.type;
     this.loadList(1);
  },
  bindDownLoad: function (e) {
      var that = this;
      if(that.data.nextPage){
          that.loadList(that.data.nextPage);
      }
  }
})
