//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");

Page({
  data: {
    windowHeight:0,
    title:'',
    content:'',
    note:'',
		nid:null,
		fromWhere:null,
		oneNote:null,
  },

  onLoad: function (options) {
    var that=this;
		
		if(options.hasOwnProperty('from')){
			that.data.fromWhere = options.from;
			
		}
		that.data.nid = options.nid;
    var title = options.title;
    var content = options.content;
    var note=options.note;
    that.setData({
      title: title,
      content: content,
      note: note,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
             
      }
    })
  },

	onShow:function(e){
		var that = this;
		if(this.data.fromWhere == 'outside'){
			wx.request({
				url: config.PytheRestfulServerURL + '/personal/note/one',
				data: {
					noteId: that.data.nid
				},
				method: 'GET',
				success: function(res) {
					if(res.data.status == 200)
					{
						that.data.oneNote = res.data.data;
						that.setData({
							title: that.data.oneNote.title,
							content: that.data.oneNote.content,
							note: that.data.oneNote.note,
							fromWhere: that.data.fromWhere,
							essayId: that.data.oneNote.essayid,
						})
					}
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}

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

  onShareAppMessage: function (res) {
		var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("wxNickName") + '的笔记分享',
      path: '/pages/toolKit/shareNote?nid=' + that.data.nid + "&from=outside",
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'none',
          image: '../../images/success.png',
          duration: 2000
        })
      },
      fail: function (res) {
        if (res.errMsg.shareAppMessage == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '取消转发',
            icon: 'none',
            image: '../../images/warn.png',
            duration: 2000
          })
        }
        console.log(res.errMsg)

      }
    }
  }

})
