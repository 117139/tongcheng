//app.js
App({
  IPurl: 'https://alaer.800123456.top/',
  IPurl1:'https://alaer.800123456.top/',
  issue:0,
  onLaunch: function () {
    // wx.request({
    //   url: this.IPurl + '/api/index/ex',
    //   data: {},
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   dataType: 'json',
    //   method: 'POST',
    //   success(res) {
    //     console.log(res.data)
    //     if (res.data.code == 1) {
    //       if (res.data.ex == 1){
    //         wx.reLaunch({
    //           url: '/pages/index/index'
    //         })
    //       }
    //     } 
    //   },
    //   fail() {
        
    //   }
    // })
    
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('userWxmsg')
    wx.removeStorageSync('tokenstr')
    wx.removeStorageSync('member')
    wx.removeStorageSync('kefu')
    let that=this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('16app'+JSON.stringify(res))
        if (res.authSetting['scope.userInfo']==true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    			wx.getUserInfo({
    				success(res) {
    					that.globalData.userInfo = res.userInfo
    					console.log(that.globalData.userInfo)
							wx.setStorageSync('userInfo', res.userInfo)
    					if(!that.globalData.userInfo){
    						wx.reLaunch({
    						  url: '/pages/login/login',
    						  fail: (err) => {
    						    console.log("失败: " + JSON.stringify(err));
    						  }
    						})
    					}else{
                wx.login({
                  success: function (res) {
                    var uinfo = that.globalData.userInfo
                    let data = {
                      code: res.code,
                      nickname: uinfo.nickName,
                      avatar: uinfo.avatarUrl,
                    }
                    let rcode = res.code
                    console.log(res.code)
                    wx.request({
                      url: that.IPurl + '/api/login/login',
                      data: data,
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      dataType: 'json',
                      method: 'POST',
                      success(res) {
                        console.log(res.data)
                        if (res.data.code == 1) {
                          console.log('登录成功')
                          wx.setStorageSync('token', res.data.data)   
                          that.issue = res.data.issue  
                        } else {
                          wx.removeStorageSync('userInfo')
                          wx.removeStorageSync('token')
                          wx.showToast({
                            icon: 'none',
                            title: '登录失败',
                          })
                        }
                      },
                      fail() {
                        wx.showToast({
                          icon: 'none',
                          title: '登录失败'
                        })
                      }
                    })
                  }
                })
							}
    				}
    			})
    			
        }else{
          // wx.reLaunch({
          //   url: '/pages/login/login',
          //   fail: (err) => {
          //     console.log("失败: " + JSON.stringify(err));
          //   }
    			// })
        }
      }
    })
  },
	dologin(type){
		let that =this
		wx.login({
		  success: function (res) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
        var uinfo = that.globalData.userInfo
		    let data = {
					// key:'server_mima',
					code:res.code,
          // apipage:'login',
          nickname: uinfo.nickName,
          avatar: uinfo.avatarUrl,
          // homeid: 0   //0用户端，1师傅端
		    }
				let rcode=res.code
				console.log(res.code)
				wx.request({
          url: that.IPurl + '/api/login/login',
					data: data,
					header: {
						'content-type': 'application/x-www-form-urlencoded' 
					},
					dataType:'json',
					method:'POST',
					success(res) {
						console.log(res.data)
						if(res.data.code==1){
              console.log('登录成功')
              wx.setStorageSync('token', res.data.data)
              that.issue = res.data.issue  
              // wx.setStorageSync('login', 'login')
              // wx.setStorageSync('morenaddress', res.data.user_member_shopping_address)
              // wx.setStorageSync('appcode', rcode)
							if(type=='shouquan'){
								// wx.reLaunch({
								//   url: '/pages/index/index',
								//   fail: (err) => {
								//     console.log("失败: " + JSON.stringify(err));
								//   }
								// })
                wx.navigateBack()
							}
							
							
							
						}else{
              wx.removeStorageSync('userInfo')
              wx.removeStorageSync('token')
              wx.showToast({
                icon:'none',
                title: '登录失败',
              })
            }
					
					},
					fail() {
						wx.showToast({
							icon:'none',
							title:'登录失败'
						})
					}
				})
		  }
		})
	},
	jump(e){
		console.log(e)
		wx.navigateTo({
			url:e.currentTarget.dataset.url
		})
	},
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  pveimg(current, urls) {
    let urls1 = []
    if (urls) {
      urls1 = urls

    } else {
      urls1[0] = current
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls1 // 需要预览的图片http链接列表
    })
  },
	retry(tit){
		wx.setNavigationBarTitle({
		  title: '加载中...',
		  success: function(res) {},
		  fail: function(res) {},
		  complete: function(res) {},
		})
		// wx.showToast({
		// 	icon:'none',
		// 	title:'调用重试方法'
		// })
		if (getCurrentPages().length != 0) {
		  getCurrentPages()[getCurrentPages().length - 1].onLoad()
		  getCurrentPages()[getCurrentPages().length - 1].onShow()
		}
		setTimeout(function(){
			wx.setNavigationBarTitle({
			  title: tit,
			})
		},1000)
	},
	
  globalData: {
    userInfo: null
  }
})