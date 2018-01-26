//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js')
const app = getApp()
Page({
  data: {
    deviceHeight:0,
    similarThree: [],
    essayId: '',
    groomType:'',
    animationData: {},
    tapTop: 0,
    tapLeft: 0,
    wh: 'width:0px;height:0px;'
  },

  onLoad: function (options) {
    var that = this;
    that.getDevice();
    console.log(options)
    that.setData({
      essayId: options.essayId,
      groomType: options.type
    })

  },

  onShow: function () {
    var that = this;
    console.log('id：' + that.data.essayId)
    console.log('type：' + that.data.groomType)
    wx.request({
      url: app.globalUrl +'essays/query?essayId=' + parseInt(that.data.essayId) + '&type=' + parseInt(that.data.groomType)+'&studentId=154',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // 获取课文，并解析
       
        var essayContain = res.data.data.essay.content;
        // var audioUrl = (res.data.data.essay.audio).search(/null/);
        WxParse.wxParse('handleEssay', 'html', essayContain, that);

        //返回课文信息
        that.setData({
          articleContentInfo: res.data.data.essay,
          // audioUrl: audioUrl
        });
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

  //  炸词
  bombHandle: function (e, options) {
    console.log(e.currentTarget.dataset.texts);
    wx.request({
      url: app.globalUrl +'xiandaiwen/double/bomb',
      data: {
        sentence: e.currentTarget.dataset.texts
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        wx.navigateTo({
          url: 'fireWord?words=' + encodeURIComponent(res.data.data),
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    var bombLocation = e.currentTarget.dataset.location;
    console.log('#location_' + bombLocation.toString());
    var sq = wx.createSelectorQuery();
    sq.select('#location_' + bombLocation.toString()).boundingClientRect(function (rect) {
      console.log(rect);
    }).exec();
  },

  // 点击推荐更多
  conMoreExtra: function (options) {
    var that = this;
    wx.navigateTo({
      url: '../extraReadList/extraReadList?essayId=' + that.data.essayId,
    });
    console.log(options)
  },

  // 点击推荐的文章
  readArticle: function (e, options) {
    var groomId = e.currentTarget.dataset.groomid;
    var groomtype = e.currentTarget.dataset.type;
    var that = this;
    console.log(groomId);
    if (groomtype == 10) {
      that.setData({
        essayId: groomId
      });
      that.onShow();
    } else {
      console.log('课外');
     
    }

  },
  tapStyle: function (e) {
    console.log(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientY);
    var tapX = e.changedTouches[0].pageX;
    var tapY = e.changedTouches[0].pageY;
    var wh = 'width:200px;height:200px;'
    this.setData({
      tapTop: tapY - 100,
      tapLeft: tapX - 100,
      wh: wh
    })
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.animation = animation;
    this.animation.scale(1, 1).step({ duration: 200 });
    this.animation.scale(10, 10).opacity(0.2).step({ duration: 200 });
    this.animation.scale(0, 0).opacity(0).step({ duration: 200 })
    // this.animation.opacity(0).step();
    this.setData({
      animationData: this.animation.export()
    })
  }
})
