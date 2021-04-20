---
title: "tinymce 自定义插件"
date: "2020-04-20"
---

## 本地引用 tinymce 项目

在 Tinymce 项目的/js/tinymce 目录下面，有一个 tinymce.js 和 tinymce.min.js 入口文件

引用对应的 js 文件会自动加载对应插件，插件全部放在 plugins 文件夹下

利用 nginx 或者 nodejs 启用 tinymce 项目

然后对应的项目再引用 tinymce，js 文件。例如 peoject 项目，找到.env.development

```javascript
VUE_APP_TINYMCE_CDNURL = "http://localhost:5050/tinymce/tinymce.min.js"
```

再启动服务即可

## 自定义插件

首先要自定义插件

在/js/tinymce/plugins/文件夹下创建属于自己的文件夹，例如：axupimgs

创建 js 文件 axupimgs.js

然后开始编写自己的插件，分以下几个步骤：

```javascript
获取 tinymce 的插件管理对象 tinymce.PluginManager

注册命令 editor.addCommand()

注册按钮和菜单栏 editor.addButton()，editor.addMenuItem()

添加插件到 tinymce.PluginManager 对象 global.add()
```

1、获取插件管理对象
// 获取插件管理对象

```javascript
var global = tinymce.util.Tools.resolve('tinymce.PluginMnager）
​2、注册命令（看情况需要与否）
var register = function (editor) {
editor.addCommand('mceImage', Dialog(editor).openLater);
editor.addCommand('mceUpdateImage', function (\_ui, data) {
editor.undoManager.transact(function () {
return insertOrUpdateImage(editor, data);
});
});
};
```

## 注册按钮和菜单

```javascript
editor.ui.registry.addButton("axupimgs", {
  icon: "axupimgs",
  tooltip: pluginName,
  onAction: function () {
    openDialog()
  },
})
editor.ui.registry.addMenuItem("axupimgs", {
  icon: "axupimgs",
  text: "图片批量上传...",
  onAction: function (element) {
    openDialog()
  },
})
```

## 添加插件到 tinymce.PluginManager 对象 global.add()

完整的 axupimgs 插件，见项目代码

## 编辑器中使用

```javascript
tinymce.init({
  toolbar: ["axupimgs"],
  plugins: ["axupimgs", "image"],
})
```

由于 axupimgs 依赖 image，所以插件中需要引用 image

## [tinymce 开发文档](https://www.tiny.cloud/docs/api/) [https://www.tiny.cloud/docs/api/](https://www.tiny.cloud/docs/api/)
