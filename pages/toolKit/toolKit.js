//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight:0, 
  },

  onLoad: function () {
      var that=this;
      that.getDevice();
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

  toolKitNotes:function(){
    wx.navigateTo({
      url: 'toolKitNotes' 
    })
  },

  toolKitwords: function () {
    wx.navigateTo({
      url: 'toolKitNewWord'
    })
  },
  toolKitExcerpt: function () {
    wx.navigateTo({
      url: 'toolKitExcerpt'
    })
  },


})
