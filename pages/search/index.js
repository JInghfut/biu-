//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
        searchAttr:{
            showClearBtn:false,
            searchValue : '',
            isEmpty1:false,
            noMore:false
        },
      content_items:[],
      url:'/list/index?keyword={keyword}&page={page}&per-page=10',
      scrollTop : 0,
      scrollHeight:0,
      nextPage:0,
      type:'',
      isLoading:false
  },
    loadList:function (page) {
        var that = this;
        if(!that.data.searchAttr.searchValue){
            return false;
        }
        if(that.data.searchAttr.isEmpty1 || that.data.searchAttr.noMore){
            return false;
        }
        var url = this.data.url.replace(/\{keyword\}/,that.data.searchAttr.searchValue);
        url = url.replace(/\{page\}/,page);
        url = app.globalData.baseUrl+url;
        console.log(url);
        wx.request({
            url: url,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var result = res.data;
                if(result.status ==1){

                    if(result.data.totalCount == 0){
                        that.setData({
                            'searchAttr.isEmpty1':true
                        });
                        console.log(that.data.searchAttr);
                        return false;
                    }else if(result.data.nextPage  === ''){
                        that.setData({
                            'searchAttr.noMore':true
                        });
                    }
                
                    that.data.nextPage = result.data.nextPage;
                    var content_items = that.data.content_items;
                    for(var i=0;i < result.data.list.length;i++){
                        content_items.push(result.data.list[i]);
                    }
                    that.setData({
                        content_items:content_items
                    });
                }

            }
        });
    },
    onLoad: function (options) {
        var that = this;
        // wx.setNavigationBarTitle({
        //     title: options.title
        // })
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        });

    },
    bindDownLoad: function (e) {
        var that = this;
        console.log(that.data.nextPage);
        if(that.data.nextPage){
            that.loadList(that.data.nextPage);
        }
    },
    writing : function(e){
        const val = e.detail.value;

        this.setData({
            'searchAttr.showClearBtn' : val != '' ? true : false,
            'searchAttr.searchValue' : val
        })
    },
    //点击清除搜索内容
    clearInput : function(e){
        this.setData({
            'searchAttr.showClearBtn' : false,
            'searchAttr.searchValue' : ''
        })
    },
    onSearch:function () {
        this.setData({
            'nextPage':0,
            'searchAttr.isEmpty1' : false,
            'searchAttr.noMore' : false
        })
        this.loadList(1);
    }
})
