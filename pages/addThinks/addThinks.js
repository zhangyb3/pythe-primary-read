//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");

Page({
  data: {
    selectedWord:'',
		selectedWordLocation:null,
		essayId:null,
  },

  onLoad: function (options) {
    console.log(options.sentence)
     var that=this;
     that.setData({
       selectedWord: decodeURIComponent(options.sentence),
			 selectedWordLocation: options.sentenceLocation,
			 essayId: options.essayId
     })
  },

	getNoteContent:function(e){
		console.log(e);
		this.data.noteContent = e.detail.value;
	},

	insertNote:function(e){
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/wx/personal/note/insert',
			data: {
				content: that.data.selectedWord,
				essayId: that.data.essayId,
				studentId: wx.getStorageSync(user.StudentID),
				note: that.data.noteContent,
				loc: that.data.selectedWordLocation,
				len: that.data.selectedWord.length
			},
			method: 'POST',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
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
