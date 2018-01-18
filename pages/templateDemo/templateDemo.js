//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceWinHeight:0 
  },

  onLoad: function () {
    this.getDeviceInfo();
  },

  // 获取用户设备信息
  getDeviceInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceWinHeight: res.windowHeight
        })
      }
    })
  },


})
