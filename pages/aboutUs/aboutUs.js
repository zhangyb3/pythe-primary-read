//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    windowHeight:0 
  },

  onLoad: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })   
        console.log(res.windowHeight)             
      }
    })
  },






})
