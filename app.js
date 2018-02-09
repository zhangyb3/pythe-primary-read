//app.js
App({
  onLaunch: function () {
    
		wx.setStorageSync('StudentID', -1);
		wx.setStorageSync("alreadyRegister", 'no');
    
  },
  globalUrl:'https://app.pythe.cn/pythe-rest/rest/',
  globalData: {
    userInfo: null
  }
})