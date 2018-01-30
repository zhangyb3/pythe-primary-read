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
		rawBook:[],
		cancelRawWords:{},
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
				var rawBookData = res.data.data;
				
				for(var count = 0; count < rawBookData.length; count++)
				{
					var temp= {};
					temp.data = rawBookData[count];
					temp.isEdit = false;
					that.data.rawBook.push(temp);
				}
				console.log("raw book", that.data.rawBook);
				that.setData({
					rawBook: that.data.rawBook,
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
				var rawBookData = res.data.data;
				var rawBook = [];
				for (var count = 0; count < rawBookData.length; count++) {
					var temp = {};
					temp.data = rawBookData[count];
					temp.isEdit = false;
					rawBook.push(temp);
				}
				var getAllData = that.data.rawBook.concat(rawBook);
				
				if (res.data.data) {
					
					that.setData({
						rawBook: getAllData,
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
	edit:function(e){
		
		var indexCount = e.currentTarget.dataset.index;
		this.data.rawBook[indexCount].isEdit = true;
		this.setData({
			rawBook: this.data.rawBook
		});

	},

	//取消编辑
	cancelEdit:function(e){
		var indexCount = e.currentTarget.dataset.index;
		this.data.rawBook[indexCount].isEdit = false;
		this.setData({
			rawBook: this.data.rawBook
		});
	},

	selectRawWord:function(e){
		console.log(e);
		var essayIndex = e.currentTarget.dataset.essay_index;
		var selectedWord = e.currentTarget.dataset.word;
		if(this.data.rawBook[essayIndex].isEdit == true)
		{
			if (this.data.cancelRawWords.hasOwnProperty(this.data.rawBook[essayIndex].data.essayid.toString()))
			{
				this.data.cancelRawWords[this.data.rawBook[essayIndex].data.essayid.toString()].push(selectedWord);
			}
			else
			{
				var temp = [];
				temp.push(selectedWord);
				this.data.cancelRawWords[this.data.rawBook[essayIndex].data.essayid.toString()]=temp;
			} 
			console.log('cancel words', this.data.cancelRawWords);
		}
		else
		{
			//到新页面

		}

	},

	cancelRawWords:function(e){
		var that = this;
		var indexCount = e.currentTarget.dataset.index;
		if (this.data.rawBook[indexCount].isEdit == true)
		{
			wx.request({
				url: config.PytheRestfulServerURL + '/personal/word/delete',
				data: {
					words: JSON.stringify(that.data.cancelRawWords[that.data.rawBook[indexCount].data.essayid.toString()]),
					status: 0,
					essayId: that.data.rawBook[indexCount].data.essayid,
					studentId: wx.getStorageSync(user.StudentID)
				},
				method: 'POST',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	},


})
