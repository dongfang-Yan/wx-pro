Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 选择日期范畴
    isFirstLoaded: false,
    currentDate:'',
    today: true,
    cost:{
      shouru: 0,
      zhichu: 0
    },
    //当月花费
    costMonth: {
      shouru: 0,
      zhichu: 0,
      jieyu: 0,
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  selectDate(e){
    this.getTodayBookKeeping(e.detail.value)
  },
  //获取今天所有的记账
  getTodayBookKeeping(date){
    this.setData({
      currentDate: date
    })
    //获取当前日期
    wx.cloud.callFunction({
      //云函数名称wx.cloud.callFunction({ 
      name: 'get_book_keeping_data',
      data: {start:date ,end: date},
      success: async (res) => {
        let data = res.result.data
        let obj = {
          shouru: data.filter(v => v.costType === 'shouru').reduce((t,v) => t + v.money * 1,0),
          zhichu: data.filter(v => v.costType === 'zhichu').reduce((t,v) => t + v.money * 1,0)
        }
        this.setData({
          cost:obj
        })
      
      },
      //请求失败执行
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [get_book_keeping_data] 调用失败 err ==> ', err);
      }
    })
  },
  getDays(year,month){
    const date = new Date(year, month, 0);
      return date.getDate();
  },
  getBalance(date) {
    let dt = date.split('-')
    let startTime = `${dt[0]}-${dt[1]}-00`
    let endTime = `${dt[0]}-${dt[1]}-${this.getDays(dt[0],dt[1])}`
    wx.cloud.callFunction({ 
      name: 'get_book_keeping_data',
      data: {start:startTime ,end: endTime},
      success: async (res) => {
        let data = res.result.data
        let shouru = data.filter(v => v.costType === 'shouru').reduce((t,o)=> t + o.money * 1,0)
        let zhichu = data.filter(v => v.costType === 'zhichu').reduce((t,o)=> t + o.money * 1,0)
        let total = shouru - zhichu
        this.setData({
          costMonth: {
            shouru,
            zhichu,
            jieyu: total.toFixed(2),
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() * 1 + 1) : date.getMonth() + 1
    let d = date.getDate()
    let nowTime = `${y}-${m}-${d}`
    this.setData({
      currentDate: nowTime
    })
    this.getTodayBookKeeping(nowTime)
    this.getBalance(nowTime)
  },
})