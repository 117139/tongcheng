//index.js
//获取应用实例
var htmlStatus = require('../../utils/htmlStatus/index.js')
const app = getApp()

Page({
	data: {
		bannerimg: [],
    statistics:'',
    cate:'',
    issue_top:'',
    notice:'',
    tablist:'',
    datalist:[],
    page:1,
    tindex:0,
		indicatorDots: true,
		autoplay: true,
		interval: 3000,
		duration: 1000,
		circular: true,
    intfuc:'',
    marquee_margin:0
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function() {
    this.getbanner()
    // this.gettype()
	},
  retry() {
    wx.setNavigationBarTitle({
      title: '加载中...',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    this.setData({
      page:1,
      datalist:[]
    })
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }
    wx.setNavigationBarTitle({
      title: '首页',
    })
  },
  onPullDownRefresh: function () {
    console.log('下拉')

    this.retry()
  },
	onShareAppMessage: function () {
	
	},
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that =this
    console.log('上拉')
    that.getdatalist(that.data.cur_id)
  },
  bindcur(e) {
    var that = this
    console.log(e.currentTarget.dataset.idx)
    if (e.currentTarget.dataset.idx != that.data.tindex){
      that.setData({
        tindex: e.currentTarget.dataset.idx,
        cur_id: e.currentTarget.dataset.id,
        page:1
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
	jump(e){
    var that =this
    clearInterval(that.data.intervalfuc)
		app.jump(e)
	},
  getbanner(){
    var that = this
    const htmlStatus1 = htmlStatus.default(that)
    wx.request({
      url: app.IPurl +'/api/index/index',
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
        if (res.data.code == 1) {  //数据为空
          // clearInterval(interval)
          var tablist=[{
            id:'',
            title:'最新'
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
          if (res.data.issue.data.length>0){
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
          
        }else {
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
  marquee0(){
    var that=this
    clearInterval(that.data.intfuc)
    that.setData({
      marquee_margin:0
    })
    that.data.intfuc = setInterval(function () {
      that.data.marquee_margin = that.data.marquee_margin + 1
      that.setData({
        marquee_margin: that.data.marquee_margin
      })
    }, 30)
    that.setData({
      intfuc: that.data.intfuc
    })
  },
  marquee1(){
    var that =this
    clearInterval(interval)
    // that.data.marquee_margin = that.data.marquee_margin + 1
    // that.setData({
    //   marquee_margin: that.data.marquee_margin
    // })
    // setTimeout(function () {
    //   that.marquee1()
    // },30)
    var interval = setInterval(function () {
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
      url: app.IPurl +'/api/index/index',
      data: {
        cate_id: id,
        page: that.data.page,
        token:wx.getStorageSync('token')
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
        if (res.data.code == 1) {  //数据为空
          if (that.data.page == 1 && res.data.issue.data.length==0){
            that.setData({
              datalist:[]
            })
            htmlStatus1.dataNull()    // 切换为空数据状态
            return
          }
          htmlStatus1.finish()
          if (res.data.issue.data.length == 0){
            wx.showToast({
              icon:'none',
              title: '到底了'
            })
            return
          }
          
          if (that.data.page == 1){
            that.data.datalist = res.data.issue.data
          }else{
            that.data.datalist = that.data.datalist.concat(res.data.issue.data)
          }
          that.data.page++
          that.setData({
            page:that.data.page,
            datalist: that.data.datalist,
          })
        }else {
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
