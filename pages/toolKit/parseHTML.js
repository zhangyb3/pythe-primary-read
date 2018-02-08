// pages/toolKit/parseHTML.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		link:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (parameters) {
		var that = this;
    wx.showLoading({
      title: '加载中',
      mask: false
    })
		that.data.link = decodeURIComponent(parameters.link);
		that.setData({
			link: that.data.link,
		});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
	onShareAppMessage: function (res) {
		var that = this;
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: wx.getStorageSync("wxNickName") + '的笔记分享',
			path: '/pages/toolKit/parseHTML?link=' + encodeURIComponent(that.data.link) ,
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


