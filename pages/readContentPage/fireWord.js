//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
var config = require("../../utils/config.js");
var user = require("../../utils/user.js");
 
Page({
  data: {
    deviceHeight:0,
    getBoomWord:[],
    classArray:[],   //点击词语后，添加一个类
    getWordExplain:'',
    hasExplain:1,
    tapWord:'',
		essayId:null,
		explainWord:null,
    scropllTop:0,
    eleTop:0
  },

  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中',
      mask: false
    })
    this.getDevice();
		this.data.essayId = options.essayId
    var getBoomWord = decodeURIComponent(options.words).split(',');
    var classArray = that.data.classArray;
    for (var i = 0; i < getBoomWord.length;i++){
        classArray[i]=''; 
    }
    console.log(getBoomWord);
    that.setData({
      getBoomWord: getBoomWord,
      classArray: classArray
    });

  },

  onShow:function(){
    setTimeout(function () {
      wx.hideLoading()
    }, 1000);
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
  
  explainWord:function(e){
    console.log(e.currentTarget.dataset.li);
    var that=this;

    wx.createSelectorQuery().selectAll('.fire-word').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        that.setData({
          scrollTop: rect.height  // 节点的高度
        })
        console.log(rect)

      })
    }).exec();

    var getWordExplain='';
    var index = e.currentTarget.dataset.li;
    this.data.explainWord = e.currentTarget.dataset.txt;
    var classArray = that.data.classArray;
    for (var i = 0; i < that.data.getBoomWord.length; i++) {
      classArray[i] = '';
    }
    classArray[index]='addBgc';
    that.setData({
      classArray: classArray,
      tapWord:e.currentTarget.dataset.li
    })
    wx.request({
      url: app.globalUrl +'xiandaiwen', //仅为示例，并非真实的接口地址
      data: {
        word: e.target.dataset.txt
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data.data.annotation);
        if (res.data.data){
          getWordExplain = res.data.data.annotation;
          // WxParse.wxParse('handleExplain', 'html', getWordExplain, that);
          that.setData({
            getWordExplain: getWordExplain,
            hasExplain:1
          })
        } else if (null == res.data.data){
          that.setData({
            hasExplain:0
          })
        }
             
      },
      fail:function(err){
          console.log(err)
      }
    })
  },

  naviToNewWord:function(){
    wx.navigateTo({
      url: '../toolKit/toolKitNewWord',
    })
  },

  addToNewBook:function(options){
    var that=this;
    var tapWord = that.data.explainWord;
    if (tapWord==null){
      wx.showToast({
        title: '尚未选择生词',
        icon:'none',
        image: '../../images/warn.png',
        duration: 2000
      })
    }else{

			wx.request({
				url: config.PytheRestfulServerURL + '/personal/word/insert',
				data: {
					word: that.data.explainWord,
					essayId: that.data.essayId,
					studentId: wx.getStorageSync(user.StudentID)
				},
				method: 'GET',
				success: function(res) {
					wx.showToast({
						title: '添加成功',
						icon: 'success',
						image: '../../images/success.png',
						duration: 2000
					})
				},
				fail: function(res) {},
				complete: function(res) {},
			})
      
    }
  }

})
