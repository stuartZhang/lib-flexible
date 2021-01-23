# lib-flexible-stzhang

点击查看原模块[lib-flexible](https://github.com/amfe/lib-flexible)的现有功能。后续内容仅只描述我新添加的特性：**基于视窗的对角线长度计算`remUnit`单位长度值**。相对于最新的适配方案[px2vw](https://www.w3cplus.com/css/vw-for-layout.html)，此对角线适配策略算是体现了`px2rem`旧方案灵活性优势的典型示例。

## 问题场景描述

1. 我需要做多个被嵌在`iframe`里的网页。包含`iframe`的上层网页由第三方团队制作 --- 我控制不了。
2. 根据【设计稿】，`iframe`的宽高比是已知的。但是，`iframe`宽高实际尺寸不确定。
3. `iframe`的运行时宽/高尺寸会随着不同的外层网页和浏览器窗口大小而变化。

即，宽高比例明确，但宽高实值要做现场自适应。

### 我要做的事情

只要`iframe`宽高比例不变，无论它的运行时宽/高尺寸如何缩放（当然也不能太离谱。比如，都小于`20px`），`iframe`内诸元素皆做**等比缩放**，以确保【设计稿】描述内容不从`iframe`中溢出和出现`iframe`滚动条。

仅只基于视窗宽度`viewWidth`的算法是不能满足这个需求的。简单地讲，旧算法只考虑了水平维度而没有把垂直维度也计算在内（少了一个维度能好使才怪）。与此同时，由于受到手机端`dpi`算法的启发（即，利用屏幕对角线长度来计算每英寸内的物理点数），我决定采用类似方式来计算视窗的`remUnit`值。实践方向一旦确定了，数学计算真心地太简单了。看下面计算公式：

  `1rem = sqrt(viewWidth^2, viewHeight^2) / 10`

## 使用方式

此插件支持两种启用方式：

1. 直接副作用导入方式
2. 导入与执行初始化函数方式

和两种适配模式：

1. 普通模式 - **使用视窗宽度`remUnit`算法**
2. 对角线模式 - **使用视窗对角线`remUnit`算法**

此外，为了不破坏原有基于视窗宽度的适配功能，我制作与导出了一个新的文件`lib-flexible-stzhang/build/flexible.umd`。它与`lib-flexible-stzhang`的默认导出共存。

### 直接副作用导入

1. 直接导入`import "lib-flexible-stzhang";`即可。这是原有功能。
2. 或者更高端一些，将其直接配置到`webpack.entry`的数组里 --- 这样就不会污染你的业务代码了。看配置代码：

```javascript
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    main: ['lib-flexible-stzhang', 'main.js']
  }
};
```

### 导入与执行初始化函数方式

请在入口文件的最开始位置，导入与执行初始化函数。

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
    // 各个功能配置选项，好奇细节，请继续阅读
});
```

`npm`包提供了类型声明文件。所以，在`vscode`里会有代码提示出现的。

## 功能配置参数

### 最小适配宽度

功能：

当视窗宽度小于此值时，

* 在【普通模式】下，就不再做缩小适配。
* 在【对角线模式】下，就不再向新对角线的计算贡献缩小比率了。

数据类型：

* 当数据类型是数字时，其长度单位是`px`。
* 当数据类型是字符时，其接受的字符串（正则）模式：`\d+(?:\.\d+)?(?:px|%)`
  * `px`代表了像素单位
  * `%`代表了相对于电脑或手机屏幕宽度`screen.availWidth`的百分数

配置方式：

* 直接副作用导入 - 此配置项是`html`标签的一个自定义数据属性`data-px2rem-min-width`

```html
<html data-px2rem-min-width="800">
  <!-- 内容 -->
</html>
```

* 导入与执行初始化函数方式

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
  minWidth: 800
});
```

### 最大适配宽度

功能：

当视窗宽度大于此值时，

* 在【普通模式】下，就不再做放大适配。
* 在【对角线模式】下，就不再向新对角线的计算贡献放大比率了。

数据类型：

* 当数据类型是数字时，其长度单位是`px`。
* 当数据类型是字符时，其接受的字符串（正则）模式：`\d+(?:\.\d+)?(?:px|%)`
  * `px`代表了像素单位
  * `%`代表了相对于电脑或手机屏幕宽度`screen.availWidth`的百分数

配置方式：

* 直接副作用导入 - 此配置项是`html`标签的一个自定义数据属性`data-px2rem-max-width`

```html
<html data-px2rem-max-width="1369">
  <!-- 内容 -->
</html>
```

* 导入与执行初始化函数方式

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
  maxWidth: 1369
});
```

### 最小适配高度

功能：

* 仅当`diagonal: true`和开启了【对角线-适配模式】时，此配置项才生效。
* 当视窗高度小于此值时，就不再向新对角线的计算贡献缩小比率了。

数据类型：

* 当数据类型是数字时，其长度单位是`px`。
* 当数据类型是字符时，其接受的字符串（正则）模式：`\d+(?:\.\d+)?(?:px|%)`
  * `px`代表了像素单位
  * `%`代表了相对于电脑或手机屏幕宽度`screen.availHeight`的百分数

配置方式：

* 直接副作用导入 - 此配置项是`html`标签的一个自定义数据属性`data-px2rem-min-height`

```html
<html data-px2rem-min-height="600">
  <!-- 内容 -->
</html>
```

* 导入与执行初始化函数方式

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
  minHeight: 600
});
```

### 最大适配高度

功能：

* 仅当`diagonal: true`和开启了【对角线-适配模式】时，此配置项才生效。
* 当视窗高度大于此值时，就不再向新对角线的计算贡献放大比率了。

数据类型：

* 当数据类型是数字时，其长度单位是`px`。
* 当数据类型是字符时，其接受的字符串（正则）模式：`\d+(?:\.\d+)?(?:px|%)`
  * `px`代表了像素单位
  * `%`代表了相对于电脑或手机屏幕宽度`screen.availHeight`的百分数

配置方式：

* 直接副作用导入 - 此配置项是`html`标签的一个自定义数据属性`data-px2rem-max-height`

```html
<html data-px2rem-max-height="900">
  <!-- 内容 -->
</html>
```

* 导入与执行初始化函数方式

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
  maxHeight: 900
});
```

### 【对角线-适配模式】开关

功能：

* 根据视窗对角线长度来计算 remUnit。

数据类型：

* 可为空的布尔类型
  * `undefined`或`false`代表关闭【对角线-适配模式】
  * `true`代表开启【对角线-适配模式】

配置方式：

* 直接副作用导入 - 此配置项是`html`标签的一个自定义数据属性`data-px2rem-diagonal`

```html
<html data-px2rem-diagonal>
  <!-- 内容 -->
</html>
```

* 导入与执行初始化函数方式

```javascript
import flexible from 'lib-flexible-stzhang/build/flexible.umd';
flexible({
  diagonal: true
});
```

## 重点

### ·视窗对角线`remUnit`算法·不能单独使用

简单地讲，【运行时换算】与【预编译时数据准备】必须算法对称。即，

1. 浏览器里使用·视窗·对角线计算`1rem`的长度。（上面）
2. `webpack-loader`.`px2rem-loader-stzhang`在打包时也得使用·设计稿·对角线来计算`1rem`。（下面）

```javascript
module.exports = {
  module: {
    rules: [{
      loader: 'px2rem-loader-stzhang',
      options: {
        exclude: [ // 第三方组件库不换算
          'node_modules/element-ui'
        ], // 使用【设计稿】对角线长度来计算 1rem。
        remUnit: Math.sqrt(Math.pow(784, 2) + Math.pow(542, 2)) / 10,
        baseDpr: 1
      }
    }]
  }
};
```

### ·视窗对角线`remUnit`算法·不是银弹。非`iframe`场景，不推荐使用

主要原因是大部分【设计稿】中的高度值都是示意高度（当不得真的）。通常，视觉设计师是期望内容沿着文档流方向自上往下顺着排，只要水平方向和【设计稿】对齐就行。这个时候，强制对齐【设计稿】对角线与【屏幕】对角线来做适配，其结果都不理想。这个从数学上也讲得通，两条对角线的斜率不一样呀！

## 两个工具函数

`__rem2px__(rem: string)`与`__px2rem__(pixels: string)`两个工具函数被直接挂在了`window`对象上方便使用。它们主要被用来在`Dev Tools`中的`Console`里，即时换算`Element`面板内`DOM`元素的尺寸大小。
