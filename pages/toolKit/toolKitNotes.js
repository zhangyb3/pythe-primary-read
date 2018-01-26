//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight:0,
    notesInfo:[    //存放用户笔记信息
      {
        'title':'昭君出塞',
        'subTitle':'王昭君是古代四大美女之一',
        'content':'文章阅读笔记文章阅读笔记文章阅读笔'
      },

      {
        'title': '昭君出塞',
        'subTitle': '王昭君是古代四大美女之一',
        'content': '文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记'
      },

      {
        'title': '昭君出塞',
        'subTitle': '王昭君是古代四大美女之一',
        'content': '文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记文章阅读笔记'
      },
    ],
    
    notesHeight: [],
    notesHeight2:[],
    foldTxt:[],
    param:[]
   
  },

  onLoad: function () {
    this.getDevice();
    var that=this;
    var notesHeight = [];
    var notesHeight2 = [];
    var foldTxt=[];
    var param=[];
    for (var i = 0; i < that.data.notesInfo.length;i++){
      notesHeight[i] = "max-height:80rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      notesHeight2[i] = "max-height:114rpx;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;";
      foldTxt[i]='展开';
      param[i]=1
    };

    that.setData({
      notesHeight: notesHeight,
      notesHeight2: notesHeight2,
      foldTxt: foldTxt,
      param: param
    });
    console.log(notesHeight)
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
    console.log(e.target.dataset.fold);
    console.log(e.target.dataset.param);
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
    
  }

})
