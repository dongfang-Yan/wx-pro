//app.js
App({
  onLaunch: function () {
    this.globalData = {
      isAuth: false,
      userInfo: {}
    } //全局对象
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    wx.getSetting({ //获取用户是否授权
      success:res => {
        if (res.authSetting['scope.userInfo']) {
          this.globalData.isAuth = true
          wx.getUserInfo({
            success: (ress) => {
              this.globalData.userInfo = ress
              wx.showToast({
                title: '授权成功',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }else{
          return wx.showToast({
            title: '请授权登录查看',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    // wx.authorize
    
  }
})
