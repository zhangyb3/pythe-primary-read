//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    windowHeight:0,
    title:'',
    content:'',
    note:''
  },

  onLoad: function (options) {
    var that=this;
    var title = options.title;
    var content = options.content;
    var note=options.note;
    that.setData({
      title: title,
      content: content,
      note: note,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
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

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("wxNickName") + '的笔记分享',
      path: '/pages/toolKit/toolKitNotes',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'none',
          image: '../../images/success.png',
          duration: 2000
        })
      },
      fail: function (res) {
        if (res.errMsg.shareAppMessage == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '取消转发',
            icon: 'none',
            image: '../../images/warn.png',
            duration: 2000
          })
        }
        console.log(res.errMsg)

      }
    }
  }

})
