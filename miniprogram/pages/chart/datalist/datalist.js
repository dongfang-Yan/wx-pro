// miniprogram/pages/datalist/datalist.js
Page({
  data: {
    datalist : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      datalist: []
    })
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    let datalist = [];
    eventChannel.on('acceptDataFromOpenerPage', data => {
      wx.cloud.callFunction({
        name: 'get_book_keeping_data',
        data: {
          start: data.data.date,
          end: data.data.date
        },
        success: (res) => {
          this.setData({
            datalist:res.result.data.filter(v => v.costType == data.data.costType && v.type == data.data.type)
          })
          // console.log("datalist=>",this.data.datalist)
        },
        fail: err => {
          wx.hideLoading();
        }
      })
    })
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

  }
})