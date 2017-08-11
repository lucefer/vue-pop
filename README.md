# vue缩放插件
基于vuejs的dom缩放插件，点击放大到屏幕中央，再点击缩小到原本位置。
#### 效果图

#### 安装
```javascript
npm install 'vue-pop' -D
```
#### 使用
```javascript
const vuePop = require('vue-pop')

Vue.use(vuePop)
```
#### 调用
```javascript
<span class="photo" v-pop = "{bgColor:item.bgColor,afterOpened:opened,afterClosed:closed}">
  <img  src= "./images/photo.jpg" />
</span>
```
#### 可选参数
* bgColor: 遮罩层背景色
* afterOpened: 放大后的钩子函数
* afterClosed: 还原到原来大小的钩子函数
* width: 放大后的宽度
* height: 放大后的高度
