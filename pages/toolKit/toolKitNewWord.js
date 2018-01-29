//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({
  data: {
    deviceHeight:0 
  },

  onLoad: function () {
    this.getDevice();
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
