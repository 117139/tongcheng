// pages/details/details.js
var htmlStatus = require('../../utils/htmlStatus/index.js')

var WxParse = require('../../vendor/wxParse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    xqData:{},
    pllist:'',
    page:1,
		bannerimg: [],
    kefu:'',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    sc:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.setNavigationBarTitle({
        title: '加载中'
      })
      this.setData({
        id:options.id,
        cate_id:options.cate_id,
        page: 1,
        pllist: []
      })
      this.getDetails()
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
    this.setData({
      page:1,
      pllist:[]
    })
    this.getDetails()
    this.getpllist('show')
  },
  retry: function () {
    this.setData({
      page: 1,
      pllist: []
    })
    this.getDetails()
    this.getpllist('show')
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
    this.setData({
      page: 1,
      pllist: []
    })
    this.getDetails()
    this.getpllist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(666)
    this.getpllist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  scbtn(e){
    var that =this
    console.log(e.currentTarget.dataset)
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    wx.request({
      url: app.IPurl + '/api/issue/collect',
      data: {
        "id": that.data.id,
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
       
        console.log(res.data)
        if (res.data.code == 1) {                           //数据不为空

          that.setData({
            sc: !that.data.sc
          })
          that.getDetails()
        } else {
          wx.showToast({
            icon: 'none',
            title: '操作失败'
          })
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '操作失败'
        })
      },
      complete() {
       
      }
    })
  },
  getDetails(id) {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl +'/api/issue/show',
      data: {
        "id": that.data.id,
        "cate_id": that.data.cate_id,
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        console.log(res.data)
       if (res.data.code==1) {                           //数据不为空
         
          that.setData({
            xqData: res.data.data,
            sc: res.data.data[0].user_collect
          })
        //  var article = res.data.model.description
        //   var subStr = new RegExp('<div>&nbsp;</div>', 'ig');
        //   article = article.replace(subStr, "<text style='margin-bottom:1em;'></text>");
        //   WxParse.wxParse('article', 'html', article, that, 5);
        //   wx.setNavigationBarTitle({
        //     title: res.data.model.name,
        //   })
       
          // htmlStatus1.finish()    // 切换为finish状态
        } else {
          if(res.data.msg){
            wx.showToast({
              icon: 'none',
              title: res.data.msg
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '加载失败'
            })
          }
          htmlStatus1.error()    // 切换为error状态
        }
      },
      fail() {
        wx.setNavigationBarTitle({
          title: '详情页',
        })
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
        htmlStatus1.error()    // 切换为error状态
      },
      complete() {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        wx.setNavigationBarTitle({
          title: '详情'
        })
      }
    })
  },
  getpllist(type){
    ///api/comment/index
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl + '/api/comment/index',
      data: {
        "issue_id": that.data.id,
        "page": that.data.page,
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
        
        console.log(res.data)
        if (res.data.code == 1) {                           //数据不为空
         
          if (that.data.page == 1 && res.data.data.data.length == 0) {
            htmlStatus1.dataNull()    // 切换为空数据状态
            return
          }
          htmlStatus1.finish()    // 切换为finish状态
          if (res.data.data.data.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '到底了'
            })
            return
          }
          if (type == "show") {
            that.setData({
              page: 1,
              pllist: []
            })
          }
          if (that.data.page==1){
            console.log(res.data.data.data)
            that.setData({
              page:2,
              pllist: res.data.data.data
            })
            // that.data.pllist = res.data.data.data
          }else{
            console.log(that.data.page)
            console.log(that.data.pllist)
            console.log(res.data.data.data)
            that.data.pllist = that.data.pllist.concat(res.data.data.data)
            that.data.page++
            that.setData({
              page: that.data.page,
              pllist: that.data.pllist,
            })
          }
         
          
          
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })
          htmlStatus1.error()    // 切换为error状态
        }
      },
      fail() {
        wx.setNavigationBarTitle({
          title: '详情',
        })
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
        htmlStatus1.error()    // 切换为error状态
      },
      complete() {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // wx.setNavigationBarTitle({
        //   title: '详情页',
        // })
      }
    })
  },
  delpl(e){
    var that =this
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '是否删除该评论',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.IPurl + '/api/comment/delete',
            data: {
              "id": e.currentTarget.dataset.id,
              token: wx.getStorageSync('token')
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'post',
            success(res) {

              console.log(res.data)
              if (res.data.code == 1) {                           //数据不为空

                that.setData({
                  page: 1,
                  pllist:[]
                })
                that.getpllist()
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '操作失败'
                })
              }
            },
            fail() {
              wx.showToast({
                icon: 'none',
                title: '操作失败'
              })
            },
            complete() { }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
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
    var that=this
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  pveimg(e) {
    var curr = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.array
    app.pveimg(curr, urls)
  }
})