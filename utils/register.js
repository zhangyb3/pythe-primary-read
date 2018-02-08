
var config = require('./config')
var user = require('./user')
var app = getApp();

const CHECK_REGISTER_URL = `${config.PytheRestfulServerURL}/user/login/prepare`;//校验是否注册

const SEND_PHONENUM_REGISTER_URL = `${config.PytheRestfulServerURL}/message/verification/`;//发送手机号注册

/**
 * 检查是否已注册
 */
var checkRegister = (success, fail) => {
	wx.request({
		url: CHECK_REGISTER_URL,
		data: {
			// SessionID: wx.getStorageSync(user.SessionID),
			openId: wx.getStorageSync(user.OpenID),

		},
		method: 'GET',
		success: function (res) {
			typeof success == "function" && success(res)
		},
		fail: function () {
			typeof success == "function" && fail(res)
		},

	})
}

/**
 * 发送验证码
 */
function sendVerificationCode(registerPhonenumber) {
	console.log("send verification code");
	wx.request({
		url: SEND_PHONENUM_REGISTER_URL,
		data: {

			// openid : wx.getStorageSync(user.OpenID),
			mobile: registerPhonenumber,
		},
		method: 'POST',
		success: function (res) {
			console.log(res);
			typeof success == "function" && success(res)
		},
		fail: function () {
			console.log(res);
			typeof success == "function" && fail(res)
		},

	})
}

function commitRegister(the) {
	var that = the;
	if (that.data.registerParams.status == 0 && that.data.registerParams.gradeId == null) {
		wx.showModal({
			title: '提示',
			content: '年级必填',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定')
				}
			}
		});
	}
	else if (that.data.registerParams.status == 1 && that.data.registerParams.subjectId == null) {
		wx.showModal({
			title: '提示',
			content: '科目必填',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定')
				}
			}
		});
	}
	else if ((that.data.registerParams.status == 1 && that.data.registerParams.subjectId != null) || (that.data.registerParams.status == 0 && that.data.registerParams.gradeId != null)) {
		//注册
		that.setData({
			lock_register: true,
		});

		wx.request({
			url: config.PytheRestfulServerURL + '/miniprogram/register',
			data: {
				status: that.data.registerParams.status,
				userName: wx.getStorageSync('wxNickName'),
				phoneNum: wx.getStorageSync('registerPhoneNum'),
				verificationCode: wx.getStorageSync('verificationCode'),
				gradeId: that.data.registerParams.gradeId,
				subjectId: that.data.registerParams.subjectId,
				openId: wx.getStorageSync(user.OpenID),
				userImg: wx.getStorageSync('avatarUrl'),
				unionId: wx.getStorageSync(user.UnionID),
			},
			method: 'POST',
			success: function (res) {
				// success
				console.log(res);
				if(res.data.status == 300){

					that.setData({
						lock_register: false,
						alreadyRegister: true,
					});
					wx.setStorageSync('alreadyRegister', 'yes');
					wx.showToast({
						title: '该手机号已注册',
						icon: 'none',
						image: '../../images/success.png',
						duration: 1000,
						complete: function (res) { 
							that.onShow();
						},
					})

					
				}
				else if (res.data.data == null) {
					wx.showModal({
						title: '提示',
						content: res.data.msg,
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定')
							}
						}
					});

					that.setData({
						lock_register: false,
					});
				}
				else{
					that.onShow();
				} 
				
			},
			fail: function () {
				// fail
				wx.showModal({
					title: '提示',
					content: '登录失败，请重试',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定')
						}
					}
				});

				that.setData({
					lock_register: false,
				});
			},

		});
	}
}

function loadRegisterSelections(the) {
	var that = the;
	console.log('load picker dataset');

	that.data.registerParams.gradeId = null;
	that.data.registerParams.subjectId = null;


	// 页面初始化 options为页面跳转所带来的参数
	that.setData({
		hide_subject_selection: true,
		hide_grade_selection: false,
		select_student: true,
		select_teacher: false
	});
	that.data.registerParams.status = 0;


	var subjectRange = ['请选择'];
	//加载动态课程列表,年级列表
	// wx.request({
	// 	url: config.PytheRestfulServerURL + '/user/register/subject',
	// 	data: {

	// 	},
	// 	method: 'GET',
	// 	success: function (res) {
	// 		// success
	// 		console.log(res.data.data);

	// 		for (var count = 0; count < res.data.data.data.length; count++) {

	// 			subjectRange[count + 1] = res.data.data.data[count].subject;
	// 			that.data.subjects[count + 1] = res.data.data.data[count];
	// 			console.log(subjectRange);
	// 		}

	// 		that.setData({
	// 			subjectRange: subjectRange,
	// 		});
	// 	},
	// 	fail: function () {
	// 		// fail
	// 	},
	// 	complete: function () {
	// 		// complete
	// 	}
	// });

	var gradeRange = ['请选择'];
	//加载动态课程列表,年级列表
	wx.request({
		url: config.PytheRestfulServerURL + '/register/grade',
		data: {

		},
		method: 'GET',
		success: function (res) {
			// success
			console.log(res.data.data);

			for (var count = 0; count < res.data.data.length; count++) {

				gradeRange[count + 1] = res.data.data[count].gradename;
				that.data.grades[count + 1] = res.data.data[count];
				console.log(gradeRange);
			}

			that.setData({
				gradeRange: gradeRange,
			});
		},
		fail: function () {
			// fail
		},
		complete: function () {
			// complete
		}
	});
}



module.exports = {
	checkRegister: checkRegister,
	sendVerificationCode: sendVerificationCode,
	loadRegisterSelections: loadRegisterSelections,
	commitRegister: commitRegister,

}