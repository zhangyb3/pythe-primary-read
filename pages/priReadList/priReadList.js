//index.js
//获取应用实例
const app = getApp()
// var temps = require('../templateDemo/templateDemo.wxml');

Page({
  data: {
    deviceHeight:0,  //设备的高
    priIndexBanner:'../../images/pri-index-banner.png',
    getUserInfo:{          //用户信息
      pic:'../../images/user-pic.jpg'
    },
    isPicker:true,        //是否显示picker弹窗，true为隐藏，false为显示
    setGrade: [           //三级联动选择
      ['人教版'],
      ['小学', '初中', '高中'],
      ['三年级上', '三年级下', '四年级上', '四年级下', '五年级上', '五年级下', '六年级上', '六年级下']
    ],
    version: 0,     //课本版本 人教版 粤教版等 滚动picker选择，然后‘确定’
    education:0,   //学历 小学 初中 高中
    userGrade:0,   //年级
    setGrade2: [           //三级联动选择
      ['人教版'],
      ['小学', '初中', '高中'],
      ['三年级上', '三年级下', '四年级上', '四年级下', '五年级上', '五年级下', '六年级上', '六年级下']
    ],
    version2: 0,   //课本版本 人教版 粤教版等 滚动picker选择，但是未‘确定’
    education2: 0,  //学历 小学 初中 高中   滚动picker选择，但是未‘确定’
    userGrade2: 0,
    gradeId: 131 ,   //1代表小学-3代表年级-1代表上册 2代表下册
    versionTxt:'人教版',
    gradeChineseData:[],
    pageNum:1,
    isLoadding:true,
    isLoadOver:true,
    isResgiste:true,
    changeIdentify:0,
    registGrade: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一级', '初二级', '初三级', '高一级', '高二级', '高三级'],
    registGradeIndex:0,
    registSubject: ['语文', '数学', '英语', '化学', '物理', '生物', '政治', '历史', '地理'],
    subjectIndex:0
  },

  onLoad: function () {
    var that=this;
    that.getDevice(); 
    // 用户的年级  
    var gradeId=131;
    that.setData({
      gradeId: gradeId
    })

    console.log('onload:'+gradeId + ',' + that.data.versionTxt);
    // 请求年级课文信息
    wx.request({
      url: app.globalUrl + 'wx/kewen?studentId=154&gradeId=' + gradeId +'&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=1&pageSize=6', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json',
      },

      // method：'GET'
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          gradeChineseData: res.data.data
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
 
//  picker-view 选择器
  changeGrade: function (e) {
    const val = e.detail.value;
    console.log(e.detail.value);
    var that=this;
    var setGrade2 = that.data.setGrade2;
    if (e.detail.value[1] == 0) {
      setGrade2[2] = ['三年级上', '三年级下', '四年级上', '四年级下', '五年级上', '五年级下', '六年级上', '六年级下'];
    } else if (e.detail.value[1] == 1) {
      setGrade2[2] = ['初一级上', '初一级下', '初二级上', '初二级下', '初三级上', '初三级下']
    } else if (e.detail.value[1] == 2) {
      setGrade2[2] = ['高一级上', '高一级下', '高二级上', '高二级下', '高三级上', '高三级下']

    }
    this.setData({
      setGrade2: setGrade2,
      version2: val[0],
      education2: val[1],
      userGrade2: val[2]
    })
  },

//  点击‘更换’按钮
  tapChangeGrade:function(){
     var that=this;
     that.setData({
       isPicker:false
     })
  },

  // picker取消
  closePicker:function(){
    var that = this;
    that.setData({
      isPicker: true
    })
  },

  // picker确定
  sureGrade:function(){
    var that=this;
    that.setData({
      setGrade: that.data.setGrade2,
      version: that.data.version2,    //版本
      education: that.data.education2, //学历 小学 初中 高中
      userGrade: that.data.userGrade2, //年级 一年级 初一 高一
       isPicker: true
    });
    var gradeId=that.data.gradeId;
    var versionTxt = that.data.setGrade[0][that.data.version];  //获取用户选择的版本
    var education = that.data.education+1;
    var userGrade = that.data.userGrade;
    if (education==1){ 
        if (userGrade==0){
           gradeId=131;
        } else if (userGrade==1){
          gradeId = 132;
        } else if (userGrade == 2) {
          gradeId = 141;
        } else if (userGrade == 3) {
          gradeId = 142;
        } else if (userGrade == 4) {
          gradeId = 151;
        } else if (userGrade == 5) {
          gradeId = 152;
        } else if (userGrade == 6) {
          gradeId = 161;
        } else if (userGrade == 7) {
          gradeId = 162;
        }
    } else if (education==2){
      if (userGrade == 0) {
        gradeId = 211;
      } else if (userGrade == 1){
        gradeId = 212;        
      } else if (userGrade == 2) {
        gradeId = 221;
      } else if (userGrade == 3) {
        gradeId = 222;
      } else if (userGrade == 4) {
        gradeId = 231;
      } else if (userGrade == 1) {
        gradeId = 232;
      }
    } else if (education == 3) {
      if (userGrade == 0) {
        gradeId = 311;
      } else if (userGrade == 1) {
        gradeId = 312;
      } else if (userGrade == 2) {
        gradeId = 321;
      } else if (userGrade == 3) {
        gradeId = 322;
      } else if (userGrade == 4) {
        gradeId = 331;
      } else if (userGrade == 1) {
        gradeId = 332;
      }
    };

    that.setData({
      versionTxt: versionTxt,
      gradeId: gradeId,
      pageNum: 1,
      isLoadOver: true
    });

    // 更换年级之后，从新请求年级课文信息
    wx.request({
      url: app.globalUrl + 'wx/kewen?studentId=154&gradeId=' + gradeId +'&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=1&pageSize=6', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          gradeChineseData: res.data.data
        })
      }
    })
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var pageNum = that.data.pageNum + 1
    that.setData({
      isLoadding: false
    })
    wx.request({
      
      // url: app.globalUrl + 'kewen?gradeId=' + that.data.gradeId + '&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=' + pageNum + '&pageSize=15&studentId=154', 
      url: app.globalUrl + 'wx/kewen?studentId=154&gradeId=' + that.data.gradeId + '&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=' + pageNum + '&pageSize=6', 
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var getAllData = that.data.gradeChineseData.concat(res.data.data)
        console.log(res.data)
        if (res.data.data) {
          if (res.data.data.length == 6) {
            console.log('成功加载数据' + res.data.data.length+'条');
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
            isLoadOver:false
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

  //  跳转，查看课文详情
  descriptCom: function (e, options) {
    var essayId = e.currentTarget.dataset.articleid;
    console.log(e.currentTarget.dataset.articleid)
    wx.navigateTo({
      url: '../readContentPage/readContentPage?essayId=' + essayId
    })
  },

//  注册，选择年级
  choiceRegGrade: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      registGradeIndex: e.detail.value
    })
  },

  subject:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      subjectIndex: e.detail.value
    })
  },

// 注册，学生身份选择
  studentIdentify:function(){
   var that=this;
   that.setData({
     changeIdentify:0
   })
  },
  // 注册，老师身份选择
  teacherIdentify: function () {
    var that = this;
    that.setData({
      changeIdentify: 1
    })
  },
 
  // 点击更多 查看更多课外阅读
  moreExtra:function(e,options){
    var that=this;
    var essayId = e.currentTarget.dataset.articleid;    
    wx.navigateTo({
      url: '../extraReadList/extraReadList?essayId=' + essayId 
    })   
  },

  //点击首页推荐课文标题
  recommDesc:function(e,options){
    console.log(e);
    var commId = e.currentTarget.dataset.commid;
    var commType = e.currentTarget.dataset.commtype;
    
    if (commType==10){
      wx.navigateTo({
        url: '../readContentPage/readContentPage?essayId=' + commId
      })
    }else{
      wx.navigateTo({
        url: '../readContentPage/extraContent?essayId=' + commId + '&type=' + commType,
      })
    }
    
  }
})
