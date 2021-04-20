---
title: "uni-app 开发小程序注意事项"
date: "2020-04-20"
---

## 数据请求 uni-request

基于 Promise 封装 uni-app 的 request 方法,h5 和小程序均可使用

使用和 axios 方式相同 具有相同的 api

特点
• 支持 Promise API

• 拦截请求和响应

• 转换请求和响应数据

• 取消请求

• 自动转换为 JSON 数据

• 超时请求

• 告别 callback

• 支持默认请求前缀

• 支持并发请求

## 图表处理

u-charts
官方介绍是这样的

全新图表组件，全端全平台支持，开箱即用，可选择 uCharts 引擎全端渲染，也可指定 PC 端或 APP 端单独使用 ECharts 引擎渲染图表。支持极简单的调用方式，只需指定图表类型及传入符合标准的图表数据即可，使开发者只需专注业务及数据。同时也支持 datacom 组件读取 uniClinetDB，无需关心如何拼接数据等不必要的重复工作，大大缩短开发时间。
具体可以去 uniapp 插件市场查看更多介绍

## 分包加载

某些情况下，开发者需要将小程序划分成不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载。
在构建小程序分包项目时，构建会输出一个或多个分包。每个使用分包小程序必定含有一个主包。所谓的主包，即放置默认启动页面/TabBar 页面，以及一些所有分包都需用到公共资源/JS 脚本；而分包则是根据开发者的配置进行划分。
在小程序启动时，默认会下载主包并启动主包内页面，当用户进入分包内某个页面时，客户端会把对应分包下载下来，下载完成后再进行展示。
目前小程序分包大小有以下限制：
整个小程序所有分包大小不超过 20M
单个分包/主包大小不能超过 2M
对小程序进行分包，可以优化小程序首次启动的下载时间，以及在多团队共同开发时可以更好的解耦协作。
分包配置方法
假设支持分包的小程序目录结构如下：

```
┌─pages
│ ├─index
│ └─index.vue
└─login
│ └─login.vue
├─pagesA
│
├─static
│
└─list
│
└─list.vue
│
├─pagesB
├─static
│ └─detail
│ └─detail.vue
├─static
├─main.js
├─App.vue
├─manifest.json
└─pages.json
```

则需要在 pages.json 中填写 subpackages 配置

```json
{
"pages": [{
"path": "pages/index/index",
"style": { ...}
}, {
"path": "pages/login/login",
"style": { ...}
}],
"subPackages": [{
"root": "pagesA",
"pages": [{
"path": "list/list",
"style": { ...}
}]
}, {
"root": "pagesB",
"pages": [{
"path": "detail/detail",
"style": { ...}
}]
}],
"preloadRule": {
"pagesA/list/list": {
"network": "all",
"packages": ["__APP__"]
},
"pagesB/detail/detail": {
"network": "all",
"packages": ["pagesA"]
}
}
}
```

subpackages 中，每个分包的配置有以下几项：

字段 类型 说明
root String 分包根目录
name String 分包别名，分包预下载时可以使用
pages StringArray 分包页面路径，相对与分包根目录

## 打包原则

声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到 app（主包） 中

app（主包）也可以有自己的 pages（即最外层的 pages 字段）

subpackage 的根目录不能是另外一个 subpackage 内的子目录

tabBar 页面必须在 app（主包）内

## 引用原则

packageA 无法 require packageB JS 文件，但可以 require app、自己 package 内的 JS 文件

packageA 无法 import packageB 的 template，但可以 require app、自己 package 内的 template

packageA 无法使用 packageB 的资源，但可以使用 app、自己 package 内的资源

## 低版本兼容

由微信后台编译来处理旧版本客户端的兼容，后台会编译两份代码包，一份是分包后代码，另外一份是整包的兼容代码。新客户端用分包，老客户端还是用的整包，完整包会把各个 subpackage 里面的路径放到 pages 中。

小程序分享功能
分享到朋友圈功能， 需要在指定分享的页面 添加如下代码框即可

```javascript
onShareAppMessage(res) {
if (res.from === 'button') {// 来自页面内分享按钮
console.log(res.target)
}
return {
title: '', // 分享的标题
path: '', // 分享的页面路径
imageUrl:"" , // 发分享的图片 （5：4）
}
}
```

打开小程序客服功能
// 第一种方式

```html
<button open-type="contact">
  {" "}
  <text>客服</text>
</button>
```

//第二种方式 带图分享

```html
<button
  open-type="contact"
  @bindcontact="handleContact"
  type="primary"
  show-message-card="true"
  send-message-title="我要分享"
  send-message-path="/pages/optional/index"
  send-message-img="../../static/laoshu.jpg"
>
  客服功能
</button>
```

消息订阅
消息能力是小程序能力中的重要组成，我们为开发者提供了订阅消息能力，以便实现服务的闭环和更优的体验。

订阅消息推送位置：服务通知

订阅消息下发条件：用户自主订阅

订阅消息卡片跳转能力：点击查看详情可跳转至该小程序的页面

订阅消息包括两种：

一次性订阅消息

一次性订阅消息用于解决用户使用小程序后，后续服务环节的通知问题。用户自主订阅后，开发者可不限时间地下发一条对应的服务消息；每条消息可单独订阅或退订。

长期订阅消息

一次性订阅消息可满足小程序的大部分服务场景需求，但线下公共服务领域存在一次性订阅无法满足的场景，如航班延误，需根据航班实时动态来多次发送消息提醒。为便于服务，我们提供了长期性订阅消息，用户订阅一次后，开发者可长期下发多条消息。

目前长期性订阅消息仅向政务民生、医疗、交通、金融、教育等线下公共服务开放，后期将逐步支持到其他线下公共服务业务。

希望对你们有帮助
