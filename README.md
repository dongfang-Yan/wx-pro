cloundfunction : 保存云函数的文件

miniprogram: 小程序开发目录
 -components 公共组件
 -images 图片
 -pages 小程序所有页面
 -style 部分小程序页面的公共样式
 -app.js 小程序注册入口
 -app.json 小程序配置
 -add.wxss 全局样式
 -sitemap.json 记录小程序页面是否能被微信索引
 微信索引： 表示页面能在微信搜索栏中搜索到

 README.md : 项目描述

 project.config.json: 保持开发的个性化配置
 wxss : 响应式单位
  标准开发
  iphone6: 1px = 2rpx
 

  项目四大模块
    |- 首页
    |- 记账
    |- 图表
    |- 我的


  小程序每个页面包含四个文件
  wxml:必须  类似html
  js :必须 
  wxss: 非必须 
  json : 非必须

  微信小程序布局
   view标签 : 类似div
   text标签 : 类似span