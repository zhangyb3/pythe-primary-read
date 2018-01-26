//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

Page({
  data: {
    deviceHeight:0,
    getBoomWord:[],
    classArray:[],   //点击词语后，添加一个类
    getWordExplain:'',
    hasExplain:1
  },

  onLoad: function (options) {
    var that=this;
    this.getDevice();
    var getBoomWord = decodeURIComponent(options.words).split(',');
    var classArray = that.data.classArray;
    for (var i = 0; i < getBoomWord.length;i++){
        classArray[i]=''; 
    }
    console.log(getBoomWord);
    that.setData({
      getBoomWord: getBoomWord,
      classArray: classArray
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
  
  explainWord:function(e){
    console.log(e.currentTarget.dataset.li);
    var that=this;
    var getWordExplain='';
    var index = e.currentTarget.dataset.li;
    var classArray = that.data.classArray;
    for (var i = 0; i < that.data.getBoomWord.length; i++) {
      classArray[i] = '';
    }
    classArray[index]='addBgc';
    that.setData({
      classArray: classArray
    })
    wx.request({
      url: app.globalUrl +'xiandaiwen', //仅为示例，并非真实的接口地址
      data: {
        word: e.target.dataset.txt
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data.data.annotation);
        if (res.data.data){
          getWordExplain = res.data.data.annotation;
          // WxParse.wxParse('handleExplain', 'html', getWordExplain, that);
          that.setData({
            getWordExplain: getWordExplain,
            hasExplain:1
          })
        } else if (null == res.data.data){
          that.setData({
            hasExplain:0
          })
        }
             
      },
      fail:function(err){
          console.log(err)
      }
    })
  }

})
