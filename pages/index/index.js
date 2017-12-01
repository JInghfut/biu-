//index.js
import listData from './data.js';
//获取应用实例
const app = getApp();
Page({
  data: {
      banner:{
          image_url:'../../images/demo/banner.jpg'
      },
      url:'/list/index?is_new=1&page={page}&per-page=20',
      content_items:[],
      scrollTop : 0,
      scrollHeight:0,
      type:'',
      nextPage:0,
      isLoading:false,
      memus:[
          {
              id:'ERGAO',
              title:'恶搞',
              type:'normal',
              image_url:'../../images/index/ico-egao.png'
          },
          {
            id:'XUANFU',
            title:'炫富',
            type:'normal',
            image_url:'../../images/index/ico-xuanfu.png'
        },
        {
            id:'LOVE',
            title:'表白',
            type:'normal',
            image_url:'../../images/index/ico-biaobai.png'
        },
        {
            id:'DOUTU',
            title:'斗图表情',
            type:'normal',
            image_url:'../../images/index/ico-doutu.png'
        },
        {
            id:'MORE',
            title:'更多',
            type:'normal',
            image_url:'../../images/index/ico-more.png'
        }
      ],
      navto: 1,  //是否跳转启动页 1跳转 0 不跳转
      broadcasting: '肌肤有困难？就找禾葡兰！千名专业美肤导师为你提供一对一服务，随时免费咨询，微信搜索小程序：禾葡兰护肤中心'
  },
    loadList:function (page) {
        var that = this;
        app.showLoading();
        var url = this.data.url.replace(/\{page\}/,page);
        url = app.globalData.baseUrl+url;
        if(that.data.isLoading){
            return false;
        }
        that.setData({
            isLoading:true
        });
        console.log(url);
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
                    for(var i=0;i < result.data.list.length;i++){
                        content_items.push(result.data.list[i]);
                    }
                    that.setData({
                        content_items:content_items
                    });
                }
                that.setData({
                    isLoading:false
                });

            },
            complete: function(res){
                app.hideLoading();
            }
        });
    },
  onLoad: function () {
      wx.setStorageSync("navto", 1)
      var that = this;
      wx.getSystemInfo({
          success:function(res){
              that.setData({
                  scrollHeight:res.windowHeight
              });
          }
      });
      this.loadList(1);
  },
  onShow: function () {
    let that = this;
    // 广告
    if (wx.getStorageSync("navto")) {
      setTimeout(function () {
        wx.navigateTo({
          url: '../star/star'
        })
      }, 20)
    }
    //滚动文字
    wx.request({
      url: "https://unify.playonweixin.com/site/get-advertisements",
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var advers = res.data.adver.advers;
          var head_adver = res.data.adver.head_adver;
          var broadcasting = res.data.adver.broadcasting;
          wx.setStorageSync("advers", advers);
          wx.setStorageSync("broadcasting", broadcasting);
          that.setData({
            broadcasting
          })
        }
      }
    })
   
  },
  toSearchPage: function (e) {
      wx.navigateTo({
          url: '../search/index'
      });
  },
    bindDownLoad: function (e) {
        var that = this;
        if(that.data.nextPage){
            that.loadList(that.data.nextPage);
        }
    },
toCategoryPage: function (e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
        url: `../category/index?type=${data.id}&title=${data.title}`
    });
}
})
