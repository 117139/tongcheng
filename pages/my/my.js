// pages/my/my.js
var WxParse = require('../../vendor/wxParse/wxParse.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issue: 0,
    userInfo:'',
    'member': wx.getStorageSync('member'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
		// var usermsg=wx.getStorageSync('userInfo')
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      issue:app.issue 
    })
    if (!app.issue){
      return
    }
    var article = app.issue
    var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
    article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
    WxParse.wxParse('article', 'html', article, that, 5);
		// if(!usermsg){
		// 	// 获取用户信息
		// 	wx.getSetting({
		// 	  success: res => {
		// 	    console.log('16app'+JSON.stringify(res))
		// 	    if (res.authSetting['scope.userInfo']==true) {
		// 	      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		// 				wx.getUserInfo({
		// 					success(res) {
		// 						app.globalData.userInfo = res.userInfo
		// 						console.log(app.globalData.userInfo)
		// 						wx.setStorageSync('userInfo', res.userInfo)
		// 						if(!app.globalData.userInfo){
		// 							wx.reLaunch({
		// 							  url: '/pages/login/login',
		// 							  fail: (err) => {
		// 							    console.log("失败: " + JSON.stringify(err));
		// 							  }
		// 							})
		// 						}else{
		// 							app.dologin()
		// 						}
		// 					}
		// 				})
						
		// 	    }else{
		// 	      wx.reLaunch({
		// 	        url: '/pages/login/login',
		// 	        fail: (err) => {
		// 	          console.log("失败: " + JSON.stringify(err));
		// 	        }
		// 				})
		// 	    }
		// 	  }
		// 	})
			
		// }else{
		// 	that.setData({
		// 		userInfo:usermsg
		// 	})
		// }
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
    this.setData({
      'member': wx.getStorageSync('member'),
      userInfo: wx.getStorageSync('userInfo')
    })
    if (wx.getStorageSync('userInfo').nickName !== undefined) {
      app.dologin()
    }
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
    if (wx.getStorageSync('userInfo').nickName !== undefined) {
      app.dologin()
    }
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '阿拉尔市本地通便民网',
      // title: that.data.goods.goods_name,
      success: function (res) {
        console.log('成功', res)

      }
    }
  },
	jump(e){
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      app.jump(e)
    }
	},
  call(e){
    app.call(e)
  }
})