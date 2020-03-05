// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 指令
import directive from '@/directive/sse'
// 移动端点击
import FastClick from 'fastclick'
// rem布局
import 'lib-flexible/flexible'
// 懒加载
import VueLazyload from 'vue-lazyload'

// 页面缓存
import Navigation from 'vue-navigation'

// vant组件
import Vant from 'vant'
import 'vant/lib/index.css'

import VueWechatTitle from 'vue-wechat-title'

import echarts from 'echarts'

import init from '@/prototype/init'
// 复制
import VueClipboard from 'vue-clipboard2'

// window.tgid = Misc.getQueryString('tgid')

// fastclick绑定到body上
FastClick.attach(document.body)
Vue.use(Vant)
Vue.use(Navigation, {router})
Vue.use(VueClipboard)
Vue.use(VueWechatTitle)
Vue.use(init)

Vue.prototype.$echarts = echarts

// 懒加载配置
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'static/error.jpeg',
  loading: 'static/loading.gif',
  attempt: 1,
  try: 3
})

// 使用指令
Vue.use(directive)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, // 路由
  store, // vuex
  components: { App },
  template: '<App/>'
})
