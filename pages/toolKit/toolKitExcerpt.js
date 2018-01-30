//index.js
//获取应用实例
const app = getApp()

var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({
  data: {
    deviceHeight: 0,
    excerptInfo: [],
    foldIcon: [],
    foldHeight: [],
    isfold: [],
		pageNum:1,
		
  },

  onLoad: function () {
    this.getDevice();
    var that = this;

    wx.request({
      url: app.globalUrl +'personal/summary/select',
      data: {
				studentId: wx.getStorageSync(user.StudentID),
				pageNum: 1,
				pageSize: 10,
			},
      method: 'GET',
      success: function (res) {
        var excerptInfo = res.data.data;
        console.log(res.data.data)
        var excerptTime =[] ;
        for (var i = 0; i < excerptInfo.length;i++){
          var time = new Date(excerptInfo[i].time);
          console.log((time))  ;    
          var exYear = time.getFullYear();
          var exMonth = time.getMonth()+1;
          if (exMonth < 10) {
            exMonth = '0' + exMonth;
          }
          var exDate = time.getDate();
          var exHour = time.getHours();
          if (exHour<10){
            exHour = '0' + exHour;
          }
          var exMinutes = time.getMinutes();
          if (exMinutes < 10) {
            exMinutes = '0' + exMinutes;
          }
          excerptInfo[i].time = exYear + '-' + exMonth + '-' + exDate + ' ' + exHour + ':' + exMinutes;
        }
        // excerptInfo.time = new Date(excerptTime); 
        that.setData({
          excerptInfo: excerptInfo
        });
        var foldIcon = [];
        var foldHeight = [];
        var isfold = [];
        for (var i = 0; i < that.data.excerptInfo.length; i++) {
          foldIcon[i] = '../../images/fold.png';
          foldHeight[i] = "max-height:104rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
          isfold[i] = 1;
        }

        that.setData({
          foldIcon: foldIcon,
          foldHeight: foldHeight,
          isfold: isfold
        })
      }
    })
    
    console.log(that.data.excerptInfo)
    
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

  foldExcerpt: function (e) {
    var that = this;
    var tapExcerpt = e.target.dataset.excerpt;
    var foldIcon = that.data.foldIcon;
    var foldHeight = that.data.foldHeight;
    var isfold = that.data.isfold;
    if (isfold[tapExcerpt] == 1) {
      foldIcon[tapExcerpt] = '../../images/unfold.png';
      foldHeight[tapExcerpt] = "max-height:auto;text-align:justify;";
      isfold[tapExcerpt] = 0;
      that.setData({
        foldIcon: foldIcon,
        foldHeight: foldHeight,
        isfold: isfold
      })
    } else if (isfold[tapExcerpt] == 0) {
      foldIcon[tapExcerpt] = '../../images/fold.png';
      foldHeight[tapExcerpt] = "max-height:104rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      isfold[tapExcerpt] = 1;
      that.setData({
        foldIcon: foldIcon,
        foldHeight: foldHeight,
        isfold: isfold
      })
    }

  },

})
