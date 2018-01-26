//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight:0,
    extraArticleList:[]
  },

  onLoad: function (options) {
    this.getDevice();
    var that=this;
    var extraArticleList=[];
    console.log(options);
    wx.request({
      url: app.globalUrl +'kewen/recommendation/more?essayId=' + options.essayId, 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);
        extraArticleList = res.data.data;
        that.setData({
          extraArticleList:extraArticleList
        })
      }
    })
  },

  // 获取用户设备信息
  getDevice: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceHeight: res.windowHeight
        })
      }
    })
  },

  extraRead:function(e,options){
    var that = this;
    var essayId = e.currentTarget.dataset.extraid;
    var groomType = e.currentTarget.dataset.type;
    if (groomType==10){
      wx.navigateTo({
        url: '../readContentPage/readContentPage?essayId=' + essayId
      });
    }else{
      console.log('课外');
      wx.navigateTo({
        url: '../readContentPage/extraContent?essayId=' + essayId + '&type=' + groomType,
      });
    }

  }

})
