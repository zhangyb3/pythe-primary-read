//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({
  data: {
    deviceHeight:0,
		pageNum:1, 
  },

  onLoad: function () {
    this.getDevice();

		var that = this;
		wx.request({
			url: app.globalUrl + 'personal/rawbook',
			data: {
				studentId: wx.getStorageSync(user.StudentID),
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				var rawBook = res.data.data;
				console.log(res.data.data)
				
				that.setData({
					rawBook: rawBook,
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


})
