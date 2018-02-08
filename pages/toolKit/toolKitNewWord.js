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
		classArray: [],
		visibleArray: [],
		rawBook:[],
		cancelRawWords:{},
		cancelRawWordsIndexes:{},
  },

  onLoad: function () {
    this.getDevice();
    wx.showLoading({
      title: '加载中',
      mask: false
    });
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
        if (res.data.data.length >= 1){

				var rawBookData = res.data.data;
        console.log(res.data.data)
				console.log(res.data.data.length)
				for(var count = 0; count < rawBookData.length; count++)
				{
					var temp= {};
					temp.data = rawBookData[count];
					temp.isEdit = false;
					that.data.classArray[count] = new Array();
					that.data.visibleArray[count] = new Array();
					for(var wordNum = 0; wordNum < rawBookData[count].wordList.length; wordNum++)
					{
						that.data.classArray[count][wordNum] = '';
						that.data.visibleArray[count][wordNum] = true;
					}
					that.data.rawBook.push(temp);
				}
				console.log("raw book", that.data.rawBook);
				that.setData({
					rawBook: that.data.rawBook,
					classArray: that.data.classArray,
					visibleArray: that.data.visibleArray,
				});

        setTimeout(function () {
          wx.hideLoading()
        }, 1000);

        }else{
          setTimeout(function () {
            wx.hideLoading()
          }, 1000);
        
          setTimeout(function(){
            wx.showToast({
              title: '你暂无生词',
              icon: 'none',
              image: '../../images/warn.png',
              duration: 4000
            })
          },1000)
          
        }
				
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
				var classArray = [];
				var visibleArray = [];
				for (var count = 0; count < rawBookData.length; count++) {
					var temp = {};
					temp.data = rawBookData[count];
					temp.isEdit = false;
					classArray[count] = new Array();
					visibleArray[count] = new Array();
					for (var wordNum = 0; wordNum < rawBookData[count].wordList.length; wordNum++) {
						classArray[count][wordNum] = '';
						visibleArray[count][wordNum] = true;
					}
					rawBook.push(temp);
				}
				var getAllData = that.data.rawBook.concat(rawBook);
				that.data.classArray = that.data.classArray.concat(classArray);
				that.data.visibleArray = that.data.visibleArray.concat(visibleArray);

				if (res.data.data) {
					
					that.setData({
						rawBook: getAllData,
						classArray: that.data.classArray,
						visibleArray: that.data.visibleArray,
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
		for(var count = 0; count < this.data.rawBook[indexCount].data.wordList.length; count++)
		{
			this.data.classArray[indexCount][count] = '';

		}
		this.data.cancelRawWords[this.data.rawBook[indexCount].data.essayid] = [];
		this.data.cancelRawWordsIndexes[this.data.rawBook[indexCount].data.essayid] = [];
		this.setData({
			rawBook: this.data.rawBook,
			classArray: this.data.classArray,
			visibleArray: this.data.visibleArray,
		});
	},

	selectRawWord:function(e){
		console.log(e);
		var essayIndex = e.currentTarget.dataset.essay_index;
		var wordIndex = e.currentTarget.dataset.index;
		var selectedWord = e.currentTarget.dataset.word;
		if(this.data.rawBook[essayIndex].isEdit == true)
		{
			this.data.classArray[essayIndex][wordIndex] = 'addBGC';
			this.setData({
				classArray: this.data.classArray,
			});
			if (this.data.cancelRawWords.hasOwnProperty(this.data.rawBook[essayIndex].data.essayid.toString()))
			{
				this.data.cancelRawWords[this.data.rawBook[essayIndex].data.essayid.toString()].push(selectedWord);
				this.data.cancelRawWordsIndexes[this.data.rawBook[essayIndex].data.essayid.toString()].push(wordIndex);
			}
			else
			{
				var temp = [];
				temp.push(selectedWord);
				this.data.cancelRawWords[this.data.rawBook[essayIndex].data.essayid.toString()]=temp;
				var indexTemp = [];
				indexTemp.push(wordIndex);
				this.data.cancelRawWordsIndexes[this.data.rawBook[essayIndex].data.essayid.toString()] = indexTemp;
			} 
			console.log('cancel words', this.data.cancelRawWords);
		}
		else
		{
			//到新页面
      wx.navigateTo({
        url: 'explainWord?word=' + e.currentTarget.dataset.word,
      })
		}

	},

	cancelRawWords:function(e){
		var that = this;
		var essayIndex = e.currentTarget.dataset.index;
		if (this.data.rawBook[essayIndex].isEdit == true)
		{
			
			//请求后台将数据删除
			wx.request({
				url: config.PytheRestfulServerURL + '/personal/word/delete',
				data: {
					words: JSON.stringify(that.data.cancelRawWords[that.data.rawBook[essayIndex].data.essayid.toString()]),
					status: 0,
					essayId: that.data.rawBook[essayIndex].data.essayid,
					studentId: wx.getStorageSync(user.StudentID)
				},
				method: 'POST',
				success: function(res) {
					if(res.data.status == 200)
					{
						//隐藏被删除的生词
						var indexes = that.data.cancelRawWordsIndexes[that.data.rawBook[essayIndex].data.essayid.toString()];
						for(var count = 0; count < indexes.length; count++)
						{
							that.data.visibleArray[essayIndex][indexes[count]] = false;
						}
						that.setData({
							visibleArray: that.data.visibleArray,
						});

						that.data.cancelRawWords[that.data.rawBook[essayIndex].data.essayid.toString()] = [];
						that.data.cancelRawWordsIndexes[that.data.rawBook[essayIndex].data.essayid.toString()] = [];
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	},


})
