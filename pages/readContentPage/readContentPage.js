//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js')
const app = getApp()
Page({
  data: {
     isPlay:0,  //状态，是否在播放中，1播放中，0暂停
     audioChangeInfo:{
       audioController: '../../images/pause.png',  //播放、暂停的图标
       audioCurrentTime:'00:00'   //当期播放时长
     },
     audioDurationTime:'00:23',//经过处理的总时间
     initdurTime:0,    //未处理的总时长
     initcurTime:0,    //未处理的当前播放时长
     barLength:0,      //灰色bar的长度
     speed: 0,          //速度=barLength/initdurTime
     colorBarWidth:0 ,   //颜色进度条长度
     barOffsetLeft:0,    //bar距离屏幕左边的距离
     articleContentInfo:{},
     isShowFixCtrl:true
  },
  
  // 限制性onready方法，改变当前播放的进度以获取音频总时长
  onReady:function(e){
    var that=this;
    this.audioCtx = wx.createAudioContext('audioFile');
    this.audioCtx.seek(1);
    setTimeout(function(){
      that.audioCtx.seek(0)
    },500);
  },

  onLoad: function (options) {
     var that=this;
     that.getRect();
     console.log(options.essayId);   

     wx.request({
       url: 'https://check.pythe.cn/pythe-rest/rest/kewen/query?studentId=151&essayId=' + options.essayId, //仅为示例，并非真实的接口地址
       data: {
         x: '',
         y: ''
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       success: function (res) {
         var essayContain= res.data.data.essay.content;
         WxParse.wxParse('handleEssay', 'html', essayContain, that);
         that.setData({
           articleContentInfo:res.data.data.essay
         })
        console.log(essayContain)
       }
     })
  },

// 音频按钮
  audioCtrer:function(){
       var that=this;
       var isPlay=that.data.isPlay;
       var audioChangeInfo = that.data.audioChangeInfo;
       if (isPlay==0){
         that.audioCtx.play();
         isPlay=1;
         audioChangeInfo.audioController ='../../images/play.png'
         
       }else{
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
  timeupdate:function(e){
    var that=this;
    var speed = that.data.barLength / that.data.initdurTime;//s=L/T(px/秒)
    that.setData({
      speed: speed,
      initdurTime: Math.round(e.detail.duration),
      initcurTime: e.detail.currentTime,      
    })
    
    // 调用处理时间的函数
    var audioDurationTime = Math.round(e.detail.duration);
    var audioCurrentTime=e.detail.currentTime;
    that.handleTime(audioDurationTime);
    that.handleCurrentTime(audioCurrentTime);

    // 每更新一次进度，颜色进度条的长度就会改变
     that.setData({
       colorBarWidth: e.detail.currentTime * speed        
     })

    
  },

//  处理时间
  handleTime:function(durat){
    var durat = Math.round(durat)
    var that=this;
    // var minueTime =Math.floor(durat / 60);
    // var secondTime=durat%60;
    // console.log(minueTime)
    // console.log(secondTime)
    if (durat<10){
       that.setData({
         audioDurationTime: '00:0' + durat
       })
    } else if (durat >= 10 ){
      if (durat<60){
        that.setData({
          audioDurationTime: '00:' + durat
        })
      } else if(durat >= 60){
        var minueTime=Math.floor(durat / 60);
        var secondTime=durat%60;
        if (minueTime<10){
          if (secondTime<10){
             that.setData({
               audioDurationTime: '0' + minueTime + ':' + '0' + secondTime
             })            
           }else{
             that.setData({
               audioDurationTime: '0' + minueTime + ':' + secondTime
             })
           }
        } else if (minueTime>=10) {
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
    var that=this;   
    wx.createSelectorQuery().select('.audio-bar-center').boundingClientRect(function (rect) { 
      that.setData({
        barLength: rect.width,
        barOffsetLeft: rect.left
      })
        // 节点的宽度
    }).exec()
  },

//  点击进度条。改变播放进度
  getTapPos:function(e){
    var that=this;
    console.log(e.detail.x);
    var tapPos=e.detail.x-that.data.barOffsetLeft;
    var calSeek = tapPos/that.data.speed;
    that.audioCtx.seek(calSeek)
  },

// 当播放结束后
  playEnd:function(){
    var that=this;
    that.audioCtx.seek(0);
    var isPlay = 0;
    var audioChangeInfo={};
    audioChangeInfo.audioController = '../../images/pause.png';
    audioChangeInfo.audioCurrentTime='00:00'
    that.setData({
      isPlay:isPlay,
      audioChangeInfo: audioChangeInfo
    })
  },

// 拖动进度条
  movePos:function(e){
    console.log(e);
    var that=this;
       console.log(e.touches[0].pageX);
       if (e.touches[0].pageX - that.data.barOffsetLeft<0){
          that.audioCtx.seek(0)         
       } else if (e.touches[0].pageX - that.data.barOffsetLeft> that.data.barLength){
         that.audioCtx.seek(that.data.initdurTime)    ;
         that.data.playEnd();              
       } else{
         var realPos =(e.touches[0].pageX - that.data.barOffsetLeft)/that.data.speed;
         that.audioCtx.seek(realPos)                  
         
       }    
    
  },

// 页面滚动事件
  onPageScroll:function(e){
    var that=this;
    if (e.scrollTop>=200){
         that.setData({
           isShowFixCtrl:false
         }) 
    }else{
        that.setData({
           isShowFixCtrl: true
         }) 
    }
  },

})
