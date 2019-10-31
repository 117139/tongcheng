// pages/orderpl/orderpl.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issue_id:'',
		content:'',
		fw:0,
		zy:0,
		plf:[1,2,3,4,5],
    o_no:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.issue_id){
      this.setData({
        issue_id: options.issue_id
      })
    }
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

  },
	bindTextAreaBlur: function(e) {
    // console.log(e.detail.value)
		this.setData({
			content:e.detail.value
		})
  },
	sub(){
		var that =this
		console.log(that.data.content)
		console.log(that.data.fw)
		console.log(that.data.zy)
    
    // return
		if(that.data.content==''){
			wx.showToast({
				icon:'none',
				title:'请输入评论'
			})
			return
		}
	
		wx.request({
      url: app.IPurl +'/api/comment/save',
			data:{
        content: that.data.content,
        issue_id:that.data.issue_id,
        "token": wx.getStorageSync('token')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded' 
			},
			dataType:'json',
			method:'post',
			success(res) {
				console.log(res.data)
				if(res.data.code==1){
          wx.showToast({
            icon: 'none',
            title: '提交成功'
          })
          setTimeout(function(){
           
            wx.navigateBack()
          },1000)
				}else{
          if (res.data.msg){
            wx.showToast({
              icon: 'none',
              title: res.data.msg
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '操作失败'
            })
          }
				}
				
			},
			fail() {
				wx.showToast({
					icon:'none',
					title:'操作失败'
				})
				 console.log('失败')
			}
		})
	}
	
})