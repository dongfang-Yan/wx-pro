var wxCharts = require('../../js/wxcharts.js');
var obj = {
  canvasId: 'Canvas',
  type: 'ring',
  title: {
    name: '空记录',
    color: '#7cb5ec',
    fontSize: 20
  },
  series: [{
    name: '',
    data: 100,
    stroke: false
  }],
  width: wx.getSystemInfoSync().windowWidth,
  height: 280,
  dataLabel: true
}
let wc = new wxCharts(obj);
Page({
  data: {
    type: 'shouru',
    total: {
      shouru: 0,
      zhichu: 0
    },
    selectDate: '',
    recoredDates: [],
  },
  onLoad: function (options) {
    
  },
  changeCharData(data) {
    let title = {
      name: '',
      color: '#7cb5ec',
      fontSize: 20
    }
    let series = data.length ? data : [
      {
        color: "rgb(76,137,244)",
        data:100,
        name: '空记录'
      }
    ]
    let obj = {
      canvasId: 'Canvas',
      type: 'ring',
      title,
      series,
      width: wx.getSystemInfoSync().windowWidth,
      height: 280,
      dataLabel: true
    }
    if(!data.length) {
      title.name = '空记录'
    }
    if(data.length && this.data.type === 'shouru') {
      title.name = '收入'
    }
    if(data.length && this.data.type === 'zhichu') {
      title.name = '支出'
    }
    wc.updateData(obj)
  },
  changeDate(e) {
    let time = e.detail.value;
    this.setData({
      selectDate: time,
      type: 'shouru'
    })
    this.getData(time)
  },
  changeIndex(e) {
    let type = e.currentTarget.dataset.type;
    if(this.data.type === type) return
    this.setData({
      type
    })
    this.getData()
  },
  getData(time = this.data.selectDate){
    wx.cloud.callFunction({ 
      name: 'get_book_keeping_data',
      data: {start:time ,end: time},
      success: async (res) => {
        if(!res.result.data) return this.changeCharData([]);
        let data = res.result.data
        const srTotal = data.filter(v => v.costType === 'shouru').reduce((t,n) => t + n.money * 1,0)
        const zcTotal = data.filter(v => v.costType === 'zhichu').reduce((t,n) => t + n.money * 1,0)
        this.setData({
          total: {
              shouru: srTotal,
              zhichu: zcTotal,
          }
        })
        const newData = data.filter(v => v.costType === this.data.type)
        let series = []
        newData.forEach((v) => {
          for(let i=0;i<series.length;i++){
            if(v.type == series[i].type) {
              return series[i].total += Number(v.money)
            }
          }
          series.push({
            total: v.money * 1,
            name: v.title,
            type: v.type,
            src: v.src,
            costType: v.costType
          })
        })
        const total = series.reduce((totle,num) => totle + num.total,0)
        
        let num = 0
        let chartData = series.map((v,i) => {
          let r = Math.floor(Math.random() * 255);
          let g = Math.floor(Math.random() * 255);
          let b = Math.floor(Math.random() * 255);

          let obj = { 
            name: v.name,
            data: 0,
            color: `rgb(${r},${g},${b})`,
            format: function (value) {
              return v.name + ' ' + (value * 100).toFixed(2) + '%'
            },
            src: v.src,
            total: v.total,
            type: v.type,
            costType: v.costType
          }
          if(i == series.length - 1) {
            obj.data = 100 - num
          }else {
             obj.data = (Number((v.total / total * 100)))
             num += obj.data
          }
          return obj
        })
        this.setData({
          recoredDates: chartData
        })
        this.changeCharData(chartData)
      },
      fail: err => {
        console.log('获取数据失败',err);
      }
      })
  },
  onShow:function(){
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() * 1 + 1) : date.getMonth() + 1
    let d = date.getDate()
    let nowTime = `${y}-${m}-${d}`
    this.setData({selectDate: nowTime})
    this.setData({
      type: 'shouru',
      selectDate: nowTime
    })
    this.getData(nowTime)
  },
  indata:function(e){
    let obj = {
      type: e.currentTarget.dataset.type,
      costType: e.currentTarget.dataset.costtype,
      date: this.data.selectDate
    }
      wx.navigateTo({
        url: 'datalist/datalist',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            // console.log(data)
          },
          someEvent: function (data) {
            // console.log(data)
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: obj })
        }
      })
    }
})
