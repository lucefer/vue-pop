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
