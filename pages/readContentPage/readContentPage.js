//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js')
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
var base = require("../../utils/base.js");

const app = getApp()
Page({
  data: {
    isPlay: 0,  //状态，是否在播放中，1播放中，0暂停
    audioChangeInfo: {
      audioController: '../../images/pause.png',  //播放、暂停的图标
      audioCurrentTime: '00:00'   //当期播放时长
    },
    audioDurationTime: '00:23',//经过处理的总时间
    initdurTime: 0,    //未处理的总时长
    initcurTime: 0,    //未处理的当前播放时长
    barLength: 0,      //灰色bar的长度
    speed: 0,          //速度=barLength/initdurTime
    colorBarWidth: 0,   //颜色进度条长度
    barOffsetLeft: 0,    //bar距离屏幕左边的距离
    articleContentInfo: {}, // 文章内容信息
    isShowFixCtrl: true,     //是否显示固定的播放器
    similarThree:[],  
    essayId:'',
    audioUrl:1,
    animationData: {},
    tapTop:0,  //点击本文时，小圆点的出现位置
    tapLeft: 0, //点击本文时，小圆点的出现位置 
    wh:'width:0px;height:0px;', //小圆点的初始宽高
    operateModel:'',
    winWidth:0,
    selectedWord:'',
		essayContent:null,
		selectedWordLocation:null,
		tempEssayContent:null,
		isAudio:false,
  },

  // 限制性onready方法，改变当前播放的进度以获取音频总时长
  onReady: function (e) {
    var that = this;
    this.audioCtx = wx.createAudioContext('audioFile');
    this.audioCtx.seek(1);
    setTimeout(function () {
      that.audioCtx.seek(0)
    }, 500);
  },

  onLoad: function (options) {
    var that = this;
    that.getRect();
    that.setData({
      essayId: options.essayId
    })
	

  },

  

 onShow:function(){
  var that=this;
   wx.request({
     url: app.globalUrl +'kewen/query',
     data: {
			studentId: wx.getStorageSync(user.StudentID),
			essayId: that.data.essayId
     },
     method:'GET',
     success: function (res) {

       // 获取课文，并解析
       var essayContain = res.data.data.essay.content;
       var audioUrl = (res.data.data.essay.audio).search(/null/);
			 if(-1==audioUrl){
				 that.setData({
					 isAudio:false,
				 });
			 }else{
				 that.setData({
					 isAudio: true,
				 });
			 }
       console.log('audioUrl'+audioUrl);
			 that.data.essayContent = essayContain;

			 //加载笔记信息后展示内容
			 wx.request({
				 url: app.globalUrl + 'wx/essay/line',
				 data: {
					 studentId: wx.getStorageSync(user.StudentID),
					 essayId: that.data.essayId
				 },
				 method: 'GET',
				 success: function(res) {
					if(res.data.status == 200)
					{
						console.log(res);
						var linesJSON = JSON.parse(res.data.data.lineC);
						var locs = [];
						var lines = {};
						var nids = {};
						for (var key in linesJSON) {
							console.log('key', key);
							var oneLine = key.split('_');
							console.log('loc', oneLine);
							locs.push(parseInt(oneLine[0]));
							lines[oneLine[0]] = oneLine[1];
							nids[oneLine[0]] = linesJSON[key].nid;
						}
						locs.sort(base.desc);
						for(var count in locs){
							
							var replaceContent = that.data.essayContent.substring(parseInt(locs[count]), parseInt(locs[count]) + parseInt(lines[locs[count]]));
							console.log('replace content', replaceContent);
							that.data.essayContent = that.data.essayContent.replace(replaceContent , "<p style='text-decoration:underline;' data-nid='" + nids[locs[count]] + "' >" + replaceContent + "</p>");
						}

					}
					console.log('after line',that.data.essayContent);
					WxParse.wxParse('handleEssay', 'html', that.data.essayContent, that);

					
				 },
				 fail: function(res) {},
				 complete: function(res) {},
			 })
       
			
       //返回课文信息
       that.setData({
         articleContentInfo: res.data.data.essay,
         audioUrl: audioUrl
       });

       wx.request({
         url: app.globalUrl +'kewen/recommendation?essayId=' + that.data.essayId,
         data: {

         },
         header: {
           'content-type': 'application/json' // 默认值
         },
         success: function (res) {
           console.log(res.data.data)

           var similarEssay = res.data.data;
           var similarThree = [];
           for (var i = 0; i < 3; i++) {
             similarThree[i] = similarEssay[i];
           }
           that.setData({
             similarThree: similarThree,
           })
         }
       })
     }
   })
 },

  // 音频按钮
  audioCtrer: function () {
    var that = this;
    var isPlay = that.data.isPlay;
    var audioChangeInfo = that.data.audioChangeInfo;
    if (isPlay == 0) {
      that.audioCtx.play();
      isPlay = 1;
      audioChangeInfo.audioController = '../../images/play.png'

    } else {
      that.audioCtx.pause();
      isPlay = 0;
      audioChangeInfo.audioController = '../../images/pause.png'

    }

    that.setData({
      isPlay: isPlay,
      audioChangeInfo: audioChangeInfo,
    })
  },

  // 播放进度更新 可以得到当前播放时间以及总时长
  timeupdate: function (e) {
    var that = this;
    var speed = that.data.barLength / that.data.initdurTime;//s=L/T(px/秒)
    that.setData({
      speed: speed,
      initdurTime: Math.round(e.detail.duration),
      initcurTime: e.detail.currentTime,
    })

    // 调用处理时间的函数
    var audioDurationTime = Math.round(e.detail.duration);
    var audioCurrentTime = e.detail.currentTime;
    that.handleTime(audioDurationTime);
    that.handleCurrentTime(audioCurrentTime);

    // 每更新一次进度，颜色进度条的长度就会改变
    that.setData({
      colorBarWidth: e.detail.currentTime * speed
    })


  },

  //  处理时间
  handleTime: function (durat) {
    var durat = Math.round(durat)
    var that = this;
    // var minueTime =Math.floor(durat / 60);
    // var secondTime=durat%60;
    // console.log(minueTime)
    // console.log(secondTime)
    if (durat < 10) {
      that.setData({
        audioDurationTime: '00:0' + durat
      })
    } else if (durat >= 10) {
      if (durat < 60) {
        that.setData({
          audioDurationTime: '00:' + durat
        })
      } else if (durat >= 60) {
        var minueTime = Math.floor(durat / 60);
        var secondTime = durat % 60;
        if (minueTime < 10) {
          if (secondTime < 10) {
            that.setData({
              audioDurationTime: '0' + minueTime + ':' + '0' + secondTime
            })
          } else {
            that.setData({
              audioDurationTime: '0' + minueTime + ':' + secondTime
            })
          }
        } else if (minueTime >= 10) {
          if (secondTime < 10) {
            that.setData({
              audioDurationTime: minueTime + ':' + '0' + secondTime
            })
          } else {
            that.setData({
              audioDurationTime: minueTime + ':' + secondTime
            })
          }

        }
      }
    }
  },

  // 处理时间
  handleCurrentTime: function (currt) {
    var that = this;
    var currt = Math.round(currt);
    var audioChangeInfo = that.data.audioChangeInfo;
    // var minueTime =Math.floor(durat / 60);
    // var secondTime=durat%60;
    // console.log(minueTime)
    // console.log(secondTime)
    if (currt < 10) {
      audioChangeInfo.audioCurrentTime = '00:0' + currt;
      that.setData({
        audioChangeInfo: that.data.audioChangeInfo
      })
    } else if (currt >= 10) {
      audioChangeInfo.audioCurrentTime = '00:' + currt
      if (currt < 60) {
        that.setData({
          audioChangeInfo: that.data.audioChangeInfo
        })
      } else if (currt >= 60) {
        var minueTime = Math.floor(currt / 60);
        var secondTime = currt % 60;
        if (minueTime < 10) {
          if (secondTime < 10) {
            audioChangeInfo.audioCurrentTime = '0' + minueTime + ':' + '0' + secondTime;
            that.setData({
              audioChangeInfo: that.data.audioChangeInfo
            })
          } else {
            audioChangeInfo.audioCurrentTime = '0' + minueTime + ':' + secondTime;
            that.setData({
              audioChangeInfo: that.data.audioChangeInfo
            })
          }
        } else if (minueTime >= 10) {
          if (secondTime < 10) {
            audioChangeInfo.audioCurrentTime = minueTime + ':' + '0' + secondTime;
            that.setData({
              audioChangeInfo: that.data.audioChangeInfo
            })
          } else {
            audioChangeInfo.audioCurrentTime = minueTime + ':' + secondTime;
            that.setData({
              audioChangeInfo: that.data.audioChangeInfo
            })
          }

        }
      }
    }
  },

  //  获取灰色bar的长度
  getRect: function () {
    var that = this;
    wx.createSelectorQuery().select('.audio-bar-center').boundingClientRect(function (rect) {
      that.setData({
        barLength: rect.width,
        barOffsetLeft: rect.left
      })
      // 节点的宽度
    }).exec()
  },

  //  点击进度条。改变播放进度
  getTapPos: function (e) {
    var that = this;
    console.log(e.detail.x);
    var tapPos = e.detail.x - that.data.barOffsetLeft;
    var calSeek = tapPos / that.data.speed;
    that.audioCtx.seek(calSeek)
  },

  // 当播放结束后
  playEnd: function () {
    var that = this;
    that.audioCtx.seek(0);
    var isPlay = 0;
    var audioChangeInfo = {};
    audioChangeInfo.audioController = '../../images/pause.png';
    audioChangeInfo.audioCurrentTime = '00:00'
    that.setData({
      isPlay: isPlay,
      audioChangeInfo: audioChangeInfo
    })
  },

  // 拖动进度条
  movePos: function (e) {
    console.log(e);
    var that = this;
    console.log(e.touches[0].pageX);
    if (e.touches[0].pageX - that.data.barOffsetLeft < 0) {
      that.audioCtx.seek(0)
    } else if (e.touches[0].pageX - that.data.barOffsetLeft > that.data.barLength) {
      that.audioCtx.seek(that.data.initdurTime);
      that.data.playEnd();
    } else {
      var realPos = (e.touches[0].pageX - that.data.barOffsetLeft) / that.data.speed;
      that.audioCtx.seek(realPos)

    }

  },

  // 页面滚动事件
  onPageScroll: function (e) {
    var that = this;
    if (e.scrollTop >= 200) {
      that.setData({
        isShowFixCtrl: false
      })
    } else {
      that.setData({
        isShowFixCtrl: true
      })
    }
  },
  
  getSentence: function (e, options){
    console.log(e.currentTarget.dataset.texts);
		var sentence = e.currentTarget.dataset.texts.text;

		var originalContent = this.data.essayContent;
		this.data.selectedWordLocation = originalContent.indexOf(sentence);
    this.setData({
      selectedWord: e.currentTarget.dataset.texts.text
    })

		//在选中文本添加特效
		this.data.tempEssayContent = this.data.essayContent;
		this.data.essayContent = this.data.essayContent.replace(sentence, "<p style='text-decoration:underline;'>" + sentence + "</p>");
		WxParse.wxParse('handleEssay', 'html', this.data.essayContent, this);

  },
//  炸词
  bombHandle: function (e,options) {
    var that=this;
    that.setData({
      operateModel: 'display:none;'
    })
    wx.request({
      url: app.globalUrl +'xiandaiwen/double/bomb',
      data: {
        sentence: that.data.selectedWord
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        wx.navigateTo({
          url: 'fireWord?words=' + encodeURIComponent(res.data.data) + "&essayId=" + that.data.essayId,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    var bombLocation = e.currentTarget.dataset.location;
    // console.log('#location_' + bombLocation.toString());
    var sq = wx.createSelectorQuery();
    sq.select('#location_' + bombLocation).boundingClientRect(function (rect) {
      console.log(rect);
    }).exec();

    
  },

	recordNotes:function(e){
		var that = this;
		wx.navigateTo({
			url: '../addThinks/addThinks?sentence=' + encodeURIComponent(this.data.selectedWord) + '&sentenceLocation=' + this.data.selectedWordLocation + '&essayId=' + this.data.essayId,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {
				that.setData({
					operateModel: 'display:none;'
				})
			},
		})
	},

	//摘抄
	extract:function(e){
		var that = this;
		wx.request({
			url: config.PytheRestfulServerURL + '/personal/summary/insert',
			data: {
				summary: that.data.selectedWord,
				essayId: that.data.essayId,
				studentId: wx.getStorageSync(user.StudentID)
			},
			method: 'POST',
			success: function(res) {
				wx.showToast({
					title: '添加成功',
					icon: 'success',
					image: '../../images/success.png',
					duration: 2000
				})
			},
			fail: function(res) {},
			complete: function(res) {
				that.setData({
					operateModel: 'display:none;'
				})
			},
		})
	},


  // 点击推荐更多
  conMoreExtra:function(options){
    var that=this;
    wx.navigateTo({
      url: '../extraReadList/extraReadList?essayId='+that.data.essayId,      
    });
    console.log(options)
  },
  
  // 点击推荐的文章
  readArticle:function(e,options){
    var groomId = e.currentTarget.dataset.groomid;
    var groomtype = e.currentTarget.dataset.type;
    var that=this;
    console.log(groomId);
    if (groomtype==10){
      that.setData({
        essayId: groomId
      });  
      that.onShow();
    }else{
      console.log('课外');
      wx.navigateTo({
        url: 'extraContent?essayId=' + groomId + '&type=' + groomtype,
      });
    }
    
  },

//点击或长按文章文本
  tapStyle:function(e){
    console.log(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientY);
    var that=this;
    var tapX = e.changedTouches[0].pageX;
    var tapY = e.changedTouches[0].pageY;
    var wh ='width:200px;height:200px;';
    // 模态弹框
    
    wx.createSelectorQuery().selectAll('.operate-model').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {    
        var operateWidth=rect.width ;  
      })
    }).exec();
    wx.getSystemInfo({
      success: function (res) {       
        that.setData({
          winWidth:res.windowWidth
        })      
      }
    })

    var operateModel='';
    var modelPosLeft = e.changedTouches[0].clientX ;
    var modelPosTop = e.changedTouches[0].clientY - 75;
    if (modelPosLeft<140){
      modelPosLeft=20;  
      operateModel = 'left:' + modelPosLeft + 'px;top:' + modelPosTop + 'px;display:block;'
    } else if (that.data.winWidth-modelPosLeft<140){
      modelPosLeft=20;
      operateModel = 'right:' + modelPosLeft + 'px;top:' + modelPosTop + 'px;display:block;'
    }else{
      modelPosLeft = e.changedTouches[0].clientX-140;
      operateModel = 'left:' + modelPosLeft + 'px;top:' + modelPosTop + 'px;display:block;'      
    }; 

    if (modelPosTop < 75) {
      modelPosTop = e.changedTouches[0].clientY+30;
      operateModel = 'left:' + modelPosLeft + 'px;top:' + modelPosTop + 'px;display:block;'
    }  
    //!!!!!
    this.setData({
      tapTop: tapY-100,
      tapLeft: tapX-100,
      wh:wh,
      operateModel: operateModel,
    })
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.animation = animation;
    this.animation.scale(1, 1).step({ duration: 200 });
    this.animation.scale(10, 10).opacity(0.2).step({ duration: 200 });
    this.animation.scale(0,0).opacity(0).step({ duration: 200 })
    // this.animation.opacity(0).step();
    this.setData({
      animationData: this.animation.export()
    })
  },

  closeModel:function(){
     var that=this;
     that.setData({
       operateModel:'display:none;'

     });
		 that.data.essayContent = that.data.tempEssayContent;
		 WxParse.wxParse('handleEssay', 'html', that.data.essayContent, that);
  }
})
