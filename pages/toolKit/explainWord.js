//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js')

const app = getApp()

Page({
  data: {
    getWordExplain:'',
    hasExplain:1
  },

  onLoad: function (options) {
    console.log(options)
    console.log(options.word);
    var that=this;
    wx.showLoading({
      title: '加载中',
      mask: false
    });
    wx.request({
      url: app.globalUrl + 'xiandaiwen', //仅为示例，并非真实的接口地址
      data: {
        word: options.word
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data.data.annotation);
        if (res.data.data) {
          var getWordExplain = res.data.data.annotation;
          // WxParse.wxParse('handleExplain', 'html', getWordExplain, that);
          that.setData({
            getWordExplain: getWordExplain,
            hasExplain: 1
          })
        } else if (null == res.data.data) {
          that.setData({
            hasExplain: 0
          })
        };

        setTimeout(function () {
          wx.hideLoading()
        }, 2000);

      },
      fail: function (err) {
        console.log(err)
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


})
