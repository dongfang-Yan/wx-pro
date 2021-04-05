// pages/mybill/mybill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'get_book_keeping_data',
      data: {
        count : -1 //获取所有账单
      },
      success: res => {
        this.setData({
          datalist: res.result.data
        })
      },
      fail:err => {
        console.log("错误请求",err)
      }
    })
  },

  deleteBill:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.cloud.callFunction({
      name: 'delete_book_keeping_data',
      data: {
        _id: id
      },
      success: res => {
        if(res.result.stats.removed == 1){
          this.data.datalist.splice(e.currentTarget.dataset.index, 1);
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            datalist:this.data.datalist
          })
        }
      },
      fail: err => {
        console.log('err =>', err)
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
})