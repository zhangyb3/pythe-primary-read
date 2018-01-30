//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({
  data: {
    deviceHeight:0,
		pageNum: 1,
		isLoadding: true,
		isLoadOver: true, 
		isEdit:true
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

	onReachBottom: function () {
		var that = this;
		var pageNum = that.data.pageNum + 1
		that.setData({
			isLoadding: false
		})
		wx.request({

			url: app.globalUrl + 'personal/rawbook',
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

	// 编辑
	edit:function(){
		this.setData({
			isEdit:false
		})
	}


})
