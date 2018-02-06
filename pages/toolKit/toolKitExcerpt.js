//index.js
//获取应用实例
const app = getApp()

var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var WxParse = require('../../wxParse/wxParse.js')
var base = require("../../utils/base.js");
Page({
  data: {
    deviceHeight: 0,
    excerptInfo: [],
    foldIcon: [],
    foldHeight: [],
    isfold: [],
		pageNum: 1,
		isLoadding: true,
		isLoadOver: true,
		
  },
  onLoad:function(){
    this.getDevice();
  },

  onShow: function () {
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

	onReachBottom: function () {
		var that = this;
		var pageNum = that.data.pageNum + 1
		that.setData({
			isLoadding: false
		})
		wx.request({

			url: app.globalUrl + 'personal/summary/select',
			data: {
				studentId: wx.getStorageSync(user.StudentID),
				pageNum: pageNum,
				pageSize: 10,
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			method: 'GET',
			success: function (res) {
				var getAllData = that.data.gradeChineseData.concat(res.data.data)
				console.log(res.data)
				if (res.data.data) {
					if (res.data.data.length == 6) {
						console.log('成功加载数据' + res.data.data.length + '条');
						that.setData({
							isLoadOver: true
						})
					} else if (res.data.data.length > 0 && res.data.data.length < 6) {
						console.log('成功加载数据' + res.data.data.length + '条');
						that.setData({
							isLoadOver: false
						})
					}
					that.setData({
						gradeChineseData: getAllData,
						pageNum: pageNum,
						isLoadding: true
					});
					console.log(that.data.pageNum);
				} else if (null == res.data.data) {
					console.log('没有更多数据加载了哟');
					that.setData({
						isLoadding: true,
						isLoadOver: false
					});
				}

				// console.log(that.data.gradeChineseData)
			},

			fail: function (err) {
				wx.showToast({
					title: '数据加载失败',
					duration: 2000
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

  delExcerpt:function(e){
    console.log(e)
    console.log('id:'+e.currentTarget.dataset.excerptid);
    var that=this;
    var summaries=[];
    summaries.push(e.currentTarget.dataset.excerptid) ;
    wx.request({
      url: app.globalUrl +'personal/sumary/delete', 
      data: {
        "studentId": wx.getStorageSync(user.StudentID),
        "summaries": JSON.stringify(summaries),
        "status": 0
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 200) {
          that.onShow();
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            image: '../../images/success.png',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '哎呀，出错了',
            icon: 'none',
            image: '../../images/warn.png',
            duration: 2000
          })
        }
      }
    })
  }

})
