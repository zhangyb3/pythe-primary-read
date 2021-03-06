//index.js
//获取应用实例
const app = getApp()
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var WxParse = require('../../wxParse/wxParse.js')
var base = require("../../utils/base.js");
var util = require("../../utils/util.js");

Page({
  data: {
    deviceHeight:0,
    notesInfo:[],
    // displays:[],
    notesHeight: [],
    notesHeight2:[],
    foldTxt:[],
    param:[],
		pageNum: 1,
		visibleArray:[],
  },

  onLoad: function () {
    this.getDevice();
    wx.showLoading({
      title: '加载中',
      mask: false
    });
  },

	onShow:function(){
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/personal/note/select',
			data: {
				studentId: wx.getStorageSync(user.StudentID),
				pageNum: 1,
				pageSize: 10,
			},
			method: 'GET',
			success: function(res) {
				if(res.data.status == 200)
				{
          if (res.data.data.length >= 1){

          console.log(res.data)
					that.data.notesInfo = res.data.data;
					for (var i = 0; i < that.data.notesInfo.length; i++) {
						var time = new Date(that.data.notesInfo[i].time);
						console.log((time));
						var exYear = time.getFullYear();
						var exMonth = time.getMonth() + 1;
						if (exMonth < 10) {
							exMonth = '0' + exMonth;
						}
						var exDate = time.getDate();
						var exHour = time.getHours();
						if (exHour < 10) {
							exHour = '0' + exHour;
						}
						var exMinutes = time.getMinutes();
						if (exMinutes < 10) {
							exMinutes = '0' + exMinutes;
						}
						that.data.notesInfo[i].time = exYear + '-' + exMonth + '-' + exDate + ' ' + exHour + ':' + exMinutes;
						that.data.visibleArray[i] = true;
					}
					that.setData({
						notesInfo: that.data.notesInfo,
						visibleArray: that.data.visibleArray
					});

          that.fold();

          setTimeout(function () {
            wx.hideLoading()
          }, 1000);

          }else{
              
            setTimeout(function () {
              wx.hideLoading()
            }, 1000);

            setTimeout(function () {
              wx.showToast({
                title: '你暂无笔记',
                icon: 'none',
                image: '../../images/warn.png',
                duration: 4000
              })
            }, 1000)

          }

				}
        
			},
			fail: function(res) {},
			complete: function(res) {},
		})
	},

  fold:function(){
    var that = this;
    var notesHeight = [];
    var notesHeight2 = [];
    var foldTxt = [];
    var param = [];
    for (var i = 0; i < that.data.notesInfo.length; i++) {
      notesHeight[i] = "max-height:80rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      notesHeight2[i] = "max-height:114rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      foldTxt[i] = '展开';
      param[i] = 1
    };

    that.setData({
      notesHeight: notesHeight,
      notesHeight2: notesHeight2,
      foldTxt: foldTxt,
      param: param
    });
    console.log(notesHeight)
  },

	onReachBottom: function () {
		var that = this;
		var pageNum = that.data.pageNum + 1
		that.setData({
			isLoadding: false
		})
		wx.request({

			url: app.globalUrl + '/personal/note/select',
			data: {
				studentId: wx.getStorageSync(user.StudentID),
				pageNum: pageNum,
				pageSize: 10,
			},
			method: 'GET',
			success: function (res) {
				var tempVisibleArray = [];
				var tempNotes = res.data.data;
				for (var i = 0; i < tempNotes.length; i++) {
					var time = new Date(tempNotes[i].time);
					console.log((time));
					var exYear = time.getFullYear();
					var exMonth = time.getMonth() + 1;
					if (exMonth < 10) {
						exMonth = '0' + exMonth;
					}
					var exDate = time.getDate();
					var exHour = time.getHours();
					if (exHour < 10) {
						exHour = '0' + exHour;
					}
					var exMinutes = time.getMinutes();
					if (exMinutes < 10) {
						exMinutes = '0' + exMinutes;
					}
					tempNotes[i].time = exYear + '-' + exMonth + '-' + exDate + ' ' + exHour + ':' + exMinutes;
					tempVisibleArray[i] = true;
				}
				var getAllData = that.data.notesInfo.concat(tempNotes);
				that.data.visibleArray = that.data.visibleArray.concat(tempVisibleArray);
				if (res.data.data) {

					that.setData({
						rawBook: getAllData,
						pageNum: pageNum,
						isLoadding: true,
						visibleArray: that.data.visibleArray,
					});
					console.log(that.data.pageNum);
				} else if (null == res.data.data) {
					console.log('没有更多数据加载了哟');
					that.setData({
						isLoadding: true,
						isLoadOver: false
					});
				}

				
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

  foldMore:function(e){
    // console.log(e.target.dataset.fold);
    // console.log(e.target.dataset.param);
    var that=this;
    var param = that.data.param;
    var fold = e.target.dataset.fold;
    var notesHeight = that.data.notesHeight;
    var notesHeight2 = that.data.notesHeight2;
    var foldTxt = that.data.foldTxt;
    if (param[e.target.dataset.fold] == 1) {
      param[e.target.dataset.fold] = 0;    
      notesHeight[fold] = "max-height:auto;text-align:justify;";
      notesHeight2[fold] = "max-height:auto;text-align:justify;" ;
      foldTxt[fold] = '收起';
      that.setData({
        notesHeight: notesHeight,  //高度
        notesHeight2: notesHeight2,  //高度
        foldTxt: foldTxt,          //展开 收起
        param: param               //data-param
      })
    } else if (param[e.target.dataset.fold] == 0){
      param[e.target.dataset.fold] = 1;    
      notesHeight[fold] = "max-height:80rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      notesHeight2[fold] = "max-height:114rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      foldTxt[fold] = '展开';
      that.setData({
        notesHeight: notesHeight,  //高度
        notesHeight2: notesHeight2,  //高度
        foldTxt: foldTxt,          //展开 收起
        param: param               //data-param
      })
    }
    
  },

  delNotes:function(e){
		var noteIndex = e.currentTarget.dataset.note_index;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定删除该笔记吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          var notes = [];
          notes.push(e.currentTarget.dataset.noteid);
          wx.request({
            url: app.globalUrl + 'personal/note/all/delete',
            data: {
              "studentId": wx.getStorageSync(user.StudentID),
              "notes": JSON.stringify(notes),
              "status": 0
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.status == 200) {
                // that.onShow();
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  image: '../../images/success.png',
                  duration: 2000
                })
								that.data.visibleArray[noteIndex] = false;
								that.setData({
									visibleArray: that.data.visibleArray,
								});
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  toShare:function(e){
    var title = e.currentTarget.dataset.title;
    var content = e.currentTarget.dataset.content;
    var note = e.currentTarget.dataset.note;
		var nid = e.currentTarget.dataset.nid;
   
    // wx.navigateTo({
    //   url: 'shareNote?title=' + title + '&content=' + content+'&note='+note + '&nid=' + nid,
    // });

		wx.navigateTo({
			url: 'parseHTML?link=' + encodeURIComponent(config.PytheServerURL + "/wxnote/shareNote.html?from=groupmessage&noteId=" + nid),
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		});
  },

toEssay:function(e,options){
  console.log(e);
  var essayType=e.currentTarget.dataset.type;
  var essayid =e.currentTarget.dataset.essayid;
  var studentid =e.currentTarget.dataset.studentid;
  if (essayType==10){
    wx.navigateTo({
      url: '../readContentPage/readContentPage?essayId=' + essayid
    })
  } else {
    wx.navigateTo({
      url: '../readContentPage/extraContent?essayId=' + essayid + '&type=' + essayType,
    })
  }
}
  

})
