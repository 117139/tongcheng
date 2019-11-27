// pages/mypl/mypl.js
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdatalist()
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
    this.setData({
      page: 1,
      datalist: []
    })
    this.getdatalist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getdatalist()
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
  retry() {
    this.setData({
      page: 1,
      datalist: []
    })
    this.getdatalist()
  },
  getdatalist() {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    var that = this
    wx.request({
      url: app.IPurl + '/api/my/review',
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
        console.log(res.data)
        if (res.data.code == 1) {  //数据为空
          if (that.data.page == 1 && res.data.data.data.length == 0) {
            that.setData({
              datalist: []
            })
            htmlStatus1.dataNull()    // 切换为空数据状态
            return
          }
          htmlStatus1.finish()
          if (res.data.data.data.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '到底了'
            })
            return
          }

          if (that.data.page == 1) {
            that.data.datalist = res.data.data.data
          } else {
            that.data.datalist = that.data.datalist.concat(res.data.data.data)
          }
          that.data.page++
          that.setData({
            page: that.data.page,
            datalist: that.data.datalist
          })
        } else {
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
  delpl(e) {
    var that = this
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
                  pllist: []
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
  jump(e) {
    app.jump(e)
  }
})