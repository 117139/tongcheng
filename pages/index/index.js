//index.js
//获取应用实例
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()

var reg = /^(\-|\+)?\d+(\.\d+)?$/;
Page({
  data: {
    bannerimg: [],
    statistics: '',
    cate: '',
    issue_top: '',
    notice: '',
    tablist: '',
    datalist: [],
    page: 1,
    tindex: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    intfuc: '',
    marquee_margin: 0,
    isshow: 0,



    height: '',
    weight: '',
    sex: '1',
    info: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this
    wx.request({
      url: app.IPurl + '/api/index/ex',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)
        if (res.data.code == 1) {
          if (res.data.ex == 1) {
            that.setData({
              isshow: 1
            })

          }else{
            that.setData({
              isshow: 2
            })
          }
        }else{
          that.setData({
            isshow: 3
          })
        }
      },
      fail() {
        that.setData({
          isshow: 3
        })
      }
    })
    that.getbanner()
    // this.gettype()
  },
  getshow(){
    var that = this
    wx.request({
      url: app.IPurl + '/api/index/ex',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success(res) {
        console.log(res.data)
        if (res.data.code == 1) {
          if (res.data.ex == 1) {
            that.setData({
              isshow: 1
            })
            that.getbanner()
          } else {
            that.setData({
              isshow: 2
            })
          }
        } else {
          that.setData({
            isshow: 3
          })
        }
      },
      fail() {
        that.setData({
          isshow: 3
        })
      }
    })
  },
  retry() {
    wx.setNavigationBarTitle({
      title: '加载中...',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      page: 1,
      datalist: []
    })
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }
    wx.setNavigationBarTitle({
      title: '首页',
    })
  },
  onPullDownRefresh: function() {
    console.log('下拉')

    this.retry()
  },
  onShareAppMessage: function() {
    return {
      title: '阿拉尔市本地通便民网',
      // title: that.data.goods.goods_name,
      success: function(res) {
        console.log('成功', res)

      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    console.log('上拉')
    that.getdatalist(that.data.cur_id)
  },
  heightInput: function(e) { //获取身高
    this.setData({
      height: e.detail.value
    })
  },
  weightInput: function(e) { //获取体重
    this.setData({
      weight: e.detail.value
    })
  },
  tapsubmit: function() { //提交事件
    var caht = this;
    if (!reg.test(this.data.height)) {
      wx.showToast({
        title: '身高不正确',
        icon: "none",
        duration: 2000
      })
      return false;
    }
    if (!reg.test(this.data.weight)) {
      wx.showToast({
        title: '体重不正确',
        icon: "none",
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '../result/result?height=' + this.data.height + '&weight=' + this.data.weight + '&sex=' + this.data.sex,
    })
  },
  selesex: function(e) { //选择性别
    this.setData({
      sex: e.target.dataset.num
    })
  },





  bindcur(e) {
    var that = this
    console.log(e.currentTarget.dataset.idx)
    if (e.currentTarget.dataset.idx != that.data.tindex) {
      that.setData({
        tindex: e.currentTarget.dataset.idx,
        cur_id: e.currentTarget.dataset.id,
        page: 1
      })
      that.getdatalist(e.currentTarget.dataset.id)
    }
    // const htmlStatus1 = htmlStatus.default(that)
    // htmlStatus1.finish()
    // that.getOrderList()
    // if (that.data.goods[that.data.type].length == 0) {
    //   that.getOrderList()
    // }
  },
  jump(e) {
    var that = this
    clearInterval(that.data.intervalfuc)
    app.jump(e)
  },
  getbanner() {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl + '/api/index/index',
      data: {

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'post',
      success(res) {
        htmlStatus1.finish()
        console.log(res.data)
        if (res.data.code == 1) { //数据为空
          // clearInterval(interval)
          var tablist = [{
            id: '',
            title: '最新'
          }]
          tablist = tablist.concat(res.data.data.cate)
          that.setData({
            bannerimg: res.data.data.ad,
            statistics: res.data.data.statistics,
            cate: res.data.data.cate,
            issue_top: res.data.data.issue_top,
            notice: res.data.data.notice,
            tablist: tablist
          })
          if (res.data.issue.data.length > 0) {
            that.data.page++
              that.setData({
                page: that.data.page,
                datalist: res.data.issue.data,
              })
          }

          // var interval = setInterval(function () {
          //   that.data.marquee_margin = that.data.marquee_margin + 1
          //   that.setData({
          //     marquee_margin: that.data.marquee_margin
          //   })
          // }, 30)
          // that.data.intfuc = interval
          // that.setData({
          //   intfuc : interval
          // })

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
  marquee0() {
    var that = this
    clearInterval(that.data.intfuc)
    that.setData({
      marquee_margin: 0
    })
    that.data.intfuc = setInterval(function() {
      that.data.marquee_margin = that.data.marquee_margin + 1
      that.setData({
        marquee_margin: that.data.marquee_margin
      })
    }, 30)
    that.setData({
      intfuc: that.data.intfuc
    })
  },
  marquee1() {
    var that = this
    clearInterval(interval)
    // that.data.marquee_margin = that.data.marquee_margin + 1
    // that.setData({
    //   marquee_margin: that.data.marquee_margin
    // })
    // setTimeout(function () {
    //   that.marquee1()
    // },30)
    var interval = setInterval(function() {
      that.data.marquee_margin = that.data.marquee_margin + 1
      that.setData({
        marquee_margin: that.data.marquee_margin
      })
    }, 30)

  },
  getdatalist(id) {
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl + '/api/index/index',
      data: {
        cate_id: id,
        page: that.data.page,
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
        if (res.data.code == 1) { //数据为空
          if (that.data.page == 1 && res.data.issue.data.length == 0) {
            that.setData({
              datalist: []
            })
            htmlStatus1.dataNull() // 切换为空数据状态
            return
          }
          htmlStatus1.finish()
          if (res.data.issue.data.length == 0) {
            wx.showToast({
              icon: 'none',
              title: '到底了'
            })
            return
          }

          if (that.data.page == 1) {
            that.data.datalist = res.data.issue.data
          } else {
            that.data.datalist = that.data.datalist.concat(res.data.issue.data)
          }
          that.data.page++
            that.setData({
              page: that.data.page,
              datalist: that.data.datalist,
            })
        } else {
          if (res.data.msg) {
            wx.showToast({
              icon: 'none',
              title: res.data.msg
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '加载失败'
            })
          }
          htmlStatus1.error() // 切换为error状态
        }
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '加载失败'
        })
        htmlStatus1.error() // 切换为error状态
      },
      complete() {
        wx.setNavigationBarTitle({
          title: '阿尔拉同城信息',
        })
      }
    })
  },

  pveimg(e) {
    var curr = e.currentTarget.dataset.src
    var urls = e.currentTarget.dataset.array
    app.pveimg(curr, urls)
  }
})