// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    bmi: '',
    status: '',
    imgurl: ['https://ssl.800123456.vip/1_11.jpg']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var num;
    var bmi;
    var status;
    if (options.sex == '1') { //男的系数
      num = 0.9;
    } else { //女的系数
      num = 0.8;
    };
    var results = this.digt((options.height - 100) * num); //标准体重
    bmi = options.weight / ((options.height / 100) * (options.height / 100)); //BMI
    if (bmi < 18.5) {
      status = '偏瘦';
    };
    if (bmi > 18.5 && bmi < 23.9) {
      status = '正常';
    };
    if (bmi > 24 && bmi < 27.9) {
      status = '偏胖';
    };
    if (bmi >= 28) {
      status = '肥胖';
    };
    this.setData({
      result: results,
      bmi: this.digt(bmi),
      status: status
    });
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '你好漂亮',
      path: '/pages/index/index',
      success: function(res) {
        console.log(res)
      }
    }
  },
  previewImages: function(e) {
    var caht = this;
    setTimeout(function() {
      wx.previewImage({
        current: caht.data.imgurl, // 当前显示图片的http链接   
        urls: caht.data.imgurl // 需要预览的图片http链接列表   
      })
    }, 1000)
  },
  digt: function(num) {
    var str = num.toString();
    if (str.indexOf('.') > 0) {
      return str.substring(0, str.indexOf('.') + 2);
    } else {
      return num
    }
  }
})