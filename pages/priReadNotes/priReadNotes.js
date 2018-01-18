//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },

  onLoad: function () {
  
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


})
