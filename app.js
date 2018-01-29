//app.js
App({
  onLaunch: function () {
    

		wx.setStorageSync("alreadyRegister", 'no');
    
  },
  globalUrl:'https://check.pythe.cn/pythe-rest/rest/',
  globalData: {
    userInfo: null
  }
})