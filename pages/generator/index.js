 //index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      content:{},
      bi_form:[],
      btnVideoPlayHide:false,
      defaultImageInput:'../../images/generator/bg-image.png',
      uploadUrl:'http://upload.zbisq.com/uploader_bi.php?type=12&app=zbshenqi&yyuid=',
      getImageUrl:'http://61.160.36.97/getimg_v2.php',
      getGifUrl:'http://bi.gif.duowan.com/getimg_v2.php',
      getVideoUrl:'http://video.zbisq.com/getimg_v2.php'

  },
  onLoad: function (option) {
    console.log(option);
      option.bi_form = decodeURIComponent(option.bi_form);
      console.log(option.bi_form)
      wx.setNavigationBarTitle({
          title: option.bi_name
      })
      //
      var bi_form = JSON.parse(option.bi_form);
      this.setData({
          'bi_form':bi_form
      });
      var imageInput = {};
      var selectInput = {};
      var isCustom = {};
      for(var i= 0;i< bi_form.length;i++)
      {

          if(bi_form[i].type == 'img'){
              imageInput["input"+i] = {
                  localImage:this.data.defaultImageInput,
                  imageUrl:'',
                  index:i
              }
          }
          if(bi_form[i].type == 'select'){
              selectInput["select"+i] = 0;
              isCustom['custom'+i] = false;
          }

      }
      this.setData({
          content:{
              id:option.id,
              bi_id:option.bi_id,
              title:option.bi_name,
              type:option.type,
              bi_preview_img:decodeURIComponent(option.bi_preview_img),
              bi_preview_video:decodeURIComponent(option.bi_preview_video),
              bi_cate_type:decodeURIComponent(option.bi_cate_type),
              bi_form:bi_form

          },
          imageInput:imageInput,
          selectInput:selectInput,
          isCustom:isCustom

      }, function() {
          // this is setData callback
      })
      console.log("content:",this.data.content);
      console.log(this.data.selectInput);

  },
  onReady: function (res) {
        this.videoContext = wx.createVideoContext('resVideo')
    },
  upload:function (e) {
      var dataset = e.currentTarget.dataset;
      var that = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              var data = {};
              data.imageInput = {};
              data.imageInput["input"+dataset.index] = {
                  'localImage':tempFilePaths[0],
                  'imageUrl':'',
                  'index':dataset.index
              }
              that.setData(data);
          }
      })
  },

  playVideo:function () {
      this.setData({
          btnVideoPlayHide:true
      }, function() {
          // this is setData callback
      })
    this.videoContext.play();
  },
  pauseVideo:function () {

  },
  timeupdateVideo:function () {

  },
  toGeneratorResultPage: function (e) {
      if(!this.checkForm()){
          return false;
      }
      wx.navigateTo({
          url: '../generator-result/index'
      });
  },
    toGeneratorImgcutPage: function (e) {
        wx.navigateTo({
            url: '../generator-imgcut/index'
        });
    },
    pickerChange:function (e) {
      var inputindex = e.target.dataset.inputindex;
      var chooseInfo = this.data.content.bi_form[inputindex].chose[e.detail.value]
      var   selectInput = this.data.selectInput;
      var  isCustom = this.data.isCustom;
        selectInput['select'+inputindex] = e.detail.value;
        if(chooseInfo.value == '自定义'){
            isCustom['custom'+inputindex] = true;
        }else{
            isCustom['custom'+inputindex] = false;
        }
        this.setData({
            selectInput: selectInput,
            isCustom:isCustom

        })
    },
    checkImage:function () {
        var isFalse = false;
        if(Object.keys(this.data.imageInput).length){
            for (var key in this.data.imageInput){
                if(this.data.imageInput[key].localImage == this.data.defaultImageInput){
                    isFalse = true;
                    break;
                }
            }
        }

        if(isFalse){
            wx.showModal({
                title: '客观别着急',
                content: '还有资料未填写哦',
                showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }else{
                        console.log('用户点击取消')
                    }

                }
            });
            return false;
        }
        return true;
    },
    checkValue:function (values) {
        var isFalse = false;

        var bi_form  = this.data.bi_form;
        console.log(bi_form);
        console.log(values);
        for (var key in values){
            if(!values[key]){
                isFalse = true;
                break;
            }

            for (var frKey in bi_form){
                if(bi_form[frKey].id == key && bi_form[frKey].type != 'img'){
                    console.log(bi_form[frKey]);
                    if(bi_form[frKey].length && bi_form[frKey].length < values[key].length)
                    {
                        if(!bi_form[frKey].label){
                            bi_form[frKey].label = bi_form[frKey].printhit.replace("请输入",'');
                            console.log(bi_form[frKey].label);
                        }
                        wx.showModal({
                            title: '提示',
                            content: `${bi_form[frKey].label}超出限制,最多输入${bi_form[frKey].length}个字`,
                            showCancel:false,
                            success: function (res) {
                                if (res.confirm) {
                                    //console.log('用户点击确定')
                                }else{
                                    //console.log('用户点击取消')
                                }

                            }
                        });
                        return false;
                    }
                }
            }
        }

        if(isFalse){
            wx.showModal({
                title: '客观别着急',
                content: '还有资料未填写哦',
                showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }else{
                        console.log('用户点击取消')
                    }

                }
            });
            return false;
        }
        return true;
    },
    formSubmit:function (e) {
        var that  =this;
        var values = e.detail.value;
        if(!this.checkImage()){
            return false;
        }
        if(Object.keys(this.data.imageInput).length){
            for (var key in this.data.imageInput){
                wx.uploadFile({
                    url: that.data.uploadUrl, //仅为示例，非真实的接口地址
                    filePath: that.data.imageInput[key].localImage,
                    name: 'upload',
                    success: function(res){
                        var data = JSON.parse(res.data);
                        var imageInput = {};
                        imageInput[key] = {
                            localImage:that.data.imageInput[key].localImage,
                            imageUrl:`${data.pic}?w=${data.width}&h=${data.height}`,
                            index:that.data.imageInput[key].index
                        }
                        that.setData({
                            imageInput:imageInput
                        });
                        values[that.data.bi_form[that.data.imageInput[key].index].id] = imageInput[key].imageUrl;
                        if(!that.checkValue(values)){
                            return false;
                        }
                        that.postData(values);
                        //do something
                    }
                })

            }
        }else{

            if(!that.checkValue(values)){
                return false;
            }
            that.postData(values);
        }

    },
    postData:function(values){
        var that = this;
        app.showLoading("稍等，正为您生成");
        var postData = {
            type:that.data.content.bi_id,
            os:'Android',
            version:'3.6.0',
            data:JSON.stringify(values)
        }
        var url = that.data.getImageUrl;
        if(that.data.content.bi_cate_type == 'gif'){
            url = that.data.getGifUrl;
        }else if(that.data.content.bi_cate_type == 'video'){
            url = that.data.getVideoUrl;
        }

        wx.request({
            url: url,
            method:"POST",
            data: postData,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                var data = res.data;
                

                var navUrl = `../generator-result/index?title=${that.data.content.title}&bi_id=${that.data.content.bi_id}&bi_cate_type=${that.data.content.bi_cate_type}&url=${encodeURIComponent(data.url)}`;
                if(that.data.content.bi_cate_type == 'video')
                {
                    navUrl += `&screenshot=${encodeURIComponent(data.screenshot)}`;
                }
                console.log(navUrl);
                wx.navigateTo({
                    url:navUrl
                });
            },
            complete:function () {
                app.hideLoading();
            }
        })
    }
})
