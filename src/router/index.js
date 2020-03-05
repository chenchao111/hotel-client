import Vue from 'vue'
import Router from 'vue-router'
// 登录相关路由
import login from './login'
// 订单相关路由
import order from './order'

import Misc from '@/utils/misc'
import { loginApi } from '@/api'

import Storage from '@/utils/storage'
const lStorage = new Storage('localStorage')

Vue.use(Router)

const routers = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '酒店预订'
    },
    component: () => import('@/views/index')
  }
]

const finalRouter = routers.concat(login, order)

const router = new Router({
  // mode: 'history',
  routes: finalRouter,
  scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  // next()
  try {
    const { name, query } = to
    if (name === 'home') {
      if (!lStorage.getItem('openid')) { // 未登录
        const code = Misc.getQueryString('code')
        const appid = 'wx6d8f52aae477fc08'
        if (!code) { // 授权
          const localLink = window.location.href
          console.log('--------微信授权--------')
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(localLink)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        } else { // code获取通行证账号
          debugger
          console.log('------授权完毕获取openid--------')
          const openid = await loginApi.queryOpenId({
            appid,
            code
          })
          lStorage.setItem('openid', openid)
          next()
        }
      } else { // 已登录
        next()
      }
    } else {
      next()
    }
  } catch (error) {
    console.warn(error)
    next()
  }
})

router.afterEach((to, from) => {
  console.log('路由结束-------')
})
export default router
