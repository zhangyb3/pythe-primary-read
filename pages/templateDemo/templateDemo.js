//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    deviceWinHeight:0 ,
    registGrade: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一级', '初二级', '初三级', '高一级', '高二级', '高三级'],
    
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

  userTelNum:function(e){
    console.log('e')
   console.log(e)
  }

})
