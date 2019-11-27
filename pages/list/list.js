// pages/list/list.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()

Page({
  data: {
    cate_id:0,
    page:1,
    datalist:[],
    title:''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.setData({
      cate_id:options.cate_id,
      title: options.title
    })
    this.getbanner()
    // this.gettype()
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
  },
  retry() {
    var that =this
    wx.setNavigationBarTitle({
      title: '加载中...',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.setData({
      page:1

    })
    that.getbanner()
    wx.setNavigationBarTitle({
      title: that.data.title,
    })
  },
	onShareAppMessage: function () {
    return {
      title: '阿拉尔市本地通便民网',
      // title: that.data.goods.goods_name,
      success: function (res) {
        console.log('成功', res)

      }
    }
  },
  onPullDownRefresh: function () {
    console.log('下拉')

    this.retry()
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this
    console.log('上拉')
    that.getbanner()
  },
  jump(e) {
    app.jump(e)
  },
  handleChange: function (e) {
    var that = this
    console.log(e.detail.current)
    that.setData({
      currentIndex: e.detail.current
    })
    if (e.detail.current == that.data.tuijian.length - 1) {
      // console.log('ajax')
      that.getHot()
    }
  },
  getbanner() {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    var that = this
    wx.request({
      url: app.IPurl +'/api/issue/index',
      data: {
        cate_id: that.data.cate_id,
        page: that.data.page,
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
        console.log(res.data)
        if (res.data.code == 1) {  //数据为空
          if (that.data.page == 1 && res.data.data.data.length==0){
            that.setData({
              datalist: []
            })
            htmlStatus1.dataNull()    // 切换为空数据状态
            return
          }
          htmlStatus1.finish()
          if (res.data.data.data.length == 0){
            wx.showToast({
              icon: 'none',
              title: '到底了'
            })
            return
          }
          
          if (that.data.page == 1){
            that.data.datalist = res.data.data.data
          }else{
            that.data.datalist = that.data.datalist.concat(res.data.data.data)
          }
          that.data.page++
          that.setData({
            page:that.data.page,
            datalist: that.data.datalist
          })
        }  else {
          htmlStatus1.error()
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })

        }
      },
      fail() {
        htmlStatus1.error()
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })

      },
      complete() {
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  gettype() {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl,
      data: {
        apipage: "shop",
        op: "grouplist",
        // tokenstr:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        // 停止下拉动作
        wx.stopPullDownRefresh();
        console.log(res.data)
        if (res.data.list.length == 0) {  //数据为空
          htmlStatus1.dataNull()    // 切换为空数据状态
          wx.showToast({
            icon: 'none',
            title: '暂无分类'
          })
        } else if (res.data.list.length > 0) {                           //数据不为空
          that.getHot()
          that.setData({
            fw_data: res.data.list
          })
          htmlStatus1.finish()    // 切换为finish状态
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })
          htmlStatus1.error()    // 切换为error状态
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
        htmlStatus1.error()    // 切换为error状态
      },
      complete() {
        wx.setNavigationBarTitle({
          title: that.data.title,
        })
      }
    })
  },
  getHot() {
    /*apipage=shop
    op = indexlist
    pageindex
    pagesize*/
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl,
      data: {
        apipage: "shop",
        op: "indexlist",
        pageindex: that.data.page,
        pagesize: 10,
        // tokenstr:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'get',
      success(res) {
        console.log(res.data)
        that.setData({
          cai_data: res.data.list3
        })
        if (res.data.list1.length == 0) {  //数据为空
          htmlStatus1.dataNull()    // 切换为空数据状态
          wx.showToast({
            icon: 'none',
            title: '暂无热门服务'
          })
        } else if (res.data.list1.length > 0) {                           //数据不为空
          that.data.hot_data = that.data.hot_data.concat(res.data.list1)
          that.setData({
            hot_data: that.data.hot_data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载失败'
          })
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
      },
      complete() {

      }
    })
  },
  pveimg(e) {
    var curr = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.array
    app.pveimg(curr, urls)
  }
})