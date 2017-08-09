import Vue from 'vue'
import App from './pop.vue'
const vuePop = require('../src/index.js')


Vue.use(vuePop)


new Vue({
  el: '#app',
  render: h => h(App)
})
