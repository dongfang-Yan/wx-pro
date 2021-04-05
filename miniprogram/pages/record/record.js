// 获取小程序实例
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperBanner: {
      indicatorDots: true,
    },
    tabbar: [
      {
        title: '收入',
        isActive: true,
        type:'shouru'
      },
      {
        title: '支出',
        isActive: false,
        type:'zhichu'
      }
    ],
    dateRange: {
      //开始日期
      start: '',
      //结束日期
      end: ''
    },
    bookKeepingData:[],
    account: [
      { title: '现金',isActive:true,type:'xianjin'},
      { title: '微信钱包',isActive:false,type:'wechatqianbao'},
      { title: '支付宝',isActive:false,type:'zhifubao'},
      { title: '储蓄卡',isActive:false,type:'chuxuka'},
      { title: '信用卡',isActive:false,type:'xinyongka'}
    ],
    date:'',
    info: {
      date: '选择记账日期',
      money: '',
      comment: ''
    },
    isAuth: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isAuth:app.globalData.isAuth
    })
    wx.offAccelerometerChange()
    this.setDate(); //获取时间
    this.getBookkeepingdata()
  },
  //获取用户信息
  getUserInfo: (res) => {
    console.log(res)
    if(res.detail){
      app.globalData.isAuth = true;
      this.setData({
        isAuth: true
      })
    }
  },
  // 获取支出收入数据库项目列表
  getBookkeepingdata(){
    wx.showLoading({
      title: '加载中',
    })

    // 调用云函数[get_book_keeping], 获取记账类型数据
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_book_keeping',
      //参数
      data: {},

      //请求成功执行
      success: res => {
        wx.hideLoading()
        // console.log('[云函数] [get_book_keeping] res ==> ', res);
        res.result.data.forEach(v => {
          v.selected = false;
        })
        this.setData({
          bookKeepingData: res.result.data
        })
      },

      //请求失败执行
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [get_book_keeping] 调用失败 err ==> ', err);
      }
    })
  },
  //选择记账类型
  selectedNav(e){
    // console.log(e)
    let data = e.currentTarget.dataset;
    let bookKeepingData = this.data.bookKeepingData;
    if(data.selected){
      return
    }
    for (let i = 0; i < bookKeepingData.length;i++){
      if (bookKeepingData[i].selected){
        bookKeepingData[i].selected=false;
        break;
      }
    }
    bookKeepingData[data.index].selected = true;
    this.setData({
      bookKeepingData
    })
  },
  // 收入支出
  chagneActive(e){
    if (e.currentTarget.dataset.active){
        console.log('当前已经激活')
        return;
    }
    let tabData = this.data.tabbar;

    for(let i = 0;i < tabData.length;i++){
      if(tabData[i].isActive){
        tabData[i].isActive = false;
        break;
      }
    }
    tabData[e.currentTarget.dataset.index].isActive = true;
    this.setData({
      tabbar:tabData
    })
  },
  accountChange(e){
    if (e.currentTarget.dataset.active) {
      // console.log('当前已经激活')
      return;
    }
    let accountData = this.data.account;

    for (let i = 0; i < accountData.length; i++) {
      if (accountData[i].isActive) {
        accountData[i].isActive = false;
        break;
      }
    }
    accountData[e.currentTarget.dataset.index].isActive = true;
    this.setData({
      account: accountData
    })
  },
  setDate() {
    //获取当前日期
    let currentDate = new Date().toLocaleDateString().split('/');
    // console.log('currentDate ==> ', currentDate);

    //开始日期
    let start = currentDate[0] - 1 + '-' + currentDate[1] + '-' + currentDate[2];
    // console.log('开始日期 =>',start);
    //结束日期
    let end = currentDate.join('-');
    // console.log('结束日期 =>',end);
    //数据响应, 如果不设置，wxml无法实现数据响应
    this.setData({
      dateRange: {
        start,
        end
      }
    })
  },
  //获取输入内容
  getInfo(e){
    // console.log(e)
    this.data.info[e.currentTarget.dataset.title] = e.detail.value;
    this.setData({
      info: this.data.info
    })
    // console.log(this.data.info)
  },
  //获取收入类型或支出类型
  bookKeeping(){
    let data = {};
    for (let i = 0; i < this.data.tabbar.length; i++) {
      if (this.data.tabbar[i].isActive) {
        data.cost = this.data.tabbar[i].title;
        data.costType = this.data.tabbar[i].type;
        break;
      }
    }
    let isSelect = false;
    for (let k = 0; k < this.data.bookKeepingData.length;k++){
      if (this.data.bookKeepingData[k].selected){
        data.bookKeepingType = this.data.bookKeepingData[k]._id;
        data.src = this.data.bookKeepingData[k].src;
        data.type = this.data.bookKeepingData[k].type;
        data.title = this.data.bookKeepingData[k].title;
        isSelect = true;
        break;
      }
    }
    if(!isSelect){
      //提示选择记账类型
      wx.showToast({
        title: '请选择记账类型',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return
    }
    for (let i = 0; i < this.data.account.length;i++){
      if(this.data.account[i].isActive){
        data.account = this.data.account[i].title;
        data.accountType = this.data.account[i].type;
        break;
      }
    }
    //判断日期
    if(this.data.info.date == '选择记账日期'){
      wx.showToast({
        title: '选择记账日期',
        icon: 'none',
        duration: 1000
      })
      return;
    }else if(this.data.info.money.trim() == ''){
      wx.showToast({
        title: '请填写金额',
        icon: 'none',
        duration: 1000
      })
      return
    }
    for(let k in this.data.info) {
      data[k] = this.data.info[k]
    }
    
    // let initObj = {
    //   date: '选择记账日期',
    //   money: '',
    //   comment: ''
    // }
    // console.log(data)
    //添加 =====》 记账记录
    wx.cloud.callFunction({
      //云函数名称
      name: 'add_book_keeping',
      //参数
      data,

      //请求成功执行
      success: res => {
        wx.hideLoading()
        // console.log('[云函数] [add_book_keeping] res ==> ', res);
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 1000
        })
        this.data.info.money = ''
        // this.setData({
        //   info: initObj
        // })
        console.log(this.data.info);
      },
      //请求失败执行
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [add_book_keeping] 调用失败 err ==> ', err);
        // this.setData({
        //   info: initObj
        // })
      }
    })
  }
})