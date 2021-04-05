let app = getApp(); //实例一个app对象
Page({
  data: {
    isAuth:false,
    userInfo: {
      avatarUrl:'',
      nickName:''
    }
  },

  onLoad:function(options){
   
  },
  onReady:function(){
    this.setData({
      isAuth: app.globalData.isAuth
    })
    if (this.data.isAuth) {
      wx.getUserInfo({
        success:res => {
          this.setData({
            userInfo: {
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            }
          })
        }
      })
    }
  },
  getUserInfo :function(res){
    if (res.detail) {
      this.globalData.isAuth = true;
      this.setData({
        isAuth: true
      })
    }
  },
  gobill:function(){
    wx.navigateTo({
      url: '../mybill/mybill',
    })
  }
})