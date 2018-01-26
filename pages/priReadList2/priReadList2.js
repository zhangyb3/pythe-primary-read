//index.js
//获取应用实例

const app = getApp()

Page({
  data: {
    deviceHeight: 0, //设备宽高
    deviceWidth: 0,  //设备宽高   
    gradeId: 131,  //1代表小学-3代表年级-1代表上册 2代表下册 
    gradeChineseData: [],   //课文列表数据
    pageNum:1, //列表加载 ，当前显示1页15条         
    isLoadding:true,  // hidden='true'表示隐藏弹窗, hidden='false'表示显示弹窗
    isLoadOver:true   //同上
  },

  onLoad: function () {
    // 设备信息
    var that = this;
    that.getDevice();
    wx.request({
      url: 'https://check.pythe.cn/pythe-rest/rest/kewen?gradeId=' + that.data.gradeId + '&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=1&pageSize=15&studentId=154', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          gradeChineseData: res.data.data
        })
      }
    })
  },

  // 获取用户设备的高
  getDevice: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceHeight: res.windowHeight,
          deviceWidth: res.windowWidth
        })
      }
    })
  },

  //  跳转，查看课文详情
  descriptCom: function (e,options) {
    var essayId = e.currentTarget.dataset.articleid;
    console.log(e.currentTarget.dataset.articleid)
    wx.navigateTo({
      url: '../readContentPage/readContentPage?essayId=' + essayId
    })
  },

  //点击标题获取年级课文列表
  showGradeList: function (e) {
    var that = this;
    var gradeId = e.target.dataset.gradeid;
    console.log(e.target.dataset.gradeid)
    this.setData({
      gradeId: gradeId,
      pageNum:1,
      isLoadOver:true
    })
    wx.request({
      url: 'https://check.pythe.cn/pythe-rest/rest/kewen?gradeId=' + gradeId + '&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=1&pageSize=15&studentId=154', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          gradeChineseData: res.data.data
        })
        console.log(that.data.gradeChineseData)
      }
    })
  },

  //上拉加载
  onReachBottom:function(){
    var that=this;  
    var pageNum = that.data.pageNum+1
    that.setData({
      isLoadding: false      
    })
    wx.request({
      url: 'https://check.pythe.cn/pythe-rest/rest/kewen?gradeId=' + that.data.gradeId + '&level1=%E4%BA%BA%E6%95%99%E7%89%88&pageNum=' + pageNum+'&pageSize=15&studentId=154', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var getAllData = that.data.gradeChineseData.concat(res.data.data)
        console.log(res.data)
        if (res.data.data){
          if (res.data.data.length == 15 ){
             console.log('成功加载数据15条');
             that.setData({
               isLoadOver:true
             })
          } else if (res.data.data.length > 0 && res.data.data.length <15){
            console.log('成功加载数据' + res.data.data.length+'条');
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
        } else if (null == res.data.data){         
          console.log('没有更多数据加载了哟');
          that.setData({
            isLoadding: true
          });
        }
        
        // console.log(that.data.gradeChineseData)
      },

      fail:function(err){
        wx.showToast({
          title: '数据加载失败',
          duration: 2000
        })

      }
    })  
  }
})
