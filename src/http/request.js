import axios from 'axios'
import store from '../store'
import { Dialog, Notify } from 'vant'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 600000, // 请求超时时间
  withCredentials: false,
  // 默认等待请求头格式
  headers: {
    // 设置请求头格式
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Content-Type':'application/x-www-form-urlencoded'
  },
  responseType: 'json'
  // 对发送请求前的请求头进行配置
  // transformRequest: [function(data, headers) {
  //   const ct = headers['Content-Type']
  //   // json 类型
  //   if (ct && ct.indexOf('application/x-www-form-urlencoded') > -1) {
  //     return JSON.stringify(data)
  //   }
  //   // FormData 类型，ie10 +
  //   if (ct && ct.indexOf('multipart/form-data') > -1) {
  //     return data
  //   }
  //   // Do whatever you want to transform the data
  //   return qs.stringify(data)
  // }]
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['authorization'] = store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.warn(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  async response => {
  /**
  * code为非0是抛错 可结合自己业务进行修改
  */
    const res = response.data

    // code和retCode都没有 默认为成功
    if (res.code === undefined && res.retCode === undefined) {
      return Promise.resolve(res)
    }
    // 成功（1.http状态码为200 2.res的code为0） ==> 需要前后台定制好code成功值
    if ((res.code !== undefined && parseInt(res.code) === 0) || (res.retCode !== undefined && parseInt(res.retCode) === 0) || (res.resultCode !== undefined && parseInt(res.resultCode) === 0)) { // res.code没有值并且retCode没有值 或者值为0
      let result = (res.data === undefined ? res : res.data)
      return Promise.resolve(result)
    }
    // 失败(1. http状态码为200 2.res的code非2000)
    if ([508, 512, 514].indexOf(res.code) > -1) { // 登出
      try {
        await store.dispatch('ClearLogin') // 清空登录信息
        Dialog.alert({
          title: '登录过期',
          message: '当前登录以超时，请重新登录!!!'
        }).then(() => {
          router.push({ path: '/login' })
        })
      } catch (error) {
        console.warn(error)
      }
    } else { // 请求接口失败
      // let errMsg = '获取接口信息失败'
      // res.msg && (errMsg = res.msg)
      // res.message && (errMsg = res.message)
      // res.resultMsg && (errMsg = res.resultMsg)
      // 针对/account/applyExpertV2_1.jspa接口单独处理
      // if ((res.retCode !== undefined && (parseInt(res.retCode) === -1001 || parseInt(res.retCode) === -1002))) {
        // return Promise.resolve(res.data)
      // } else {
      const errMsg = (res.msg ? res.msg : (res.resultMsg ? res.resultMsg : (res.message ? res.message : '获取接口信息失败')))
      Notify(errMsg) // 显示错误信息
      return Promise.reject(res)
      // }
    }
    return Promise.reject(res)
  },
  // 失败 http状态码非200
  error => {
    // Dialog.alert({
    //   title: '网络异常',
    //   message: '当前网络异常，请稍后再试!!!'
    // }).then(() => {

    // })
    return Promise.reject(error)
  }
)

// axios本版本不支持jsonp 自己拓展一个
service.jsonp = (url) => {
  if (!url) {
    console.error('Axios.JSONP 至少需要一个url参数!')
    return
  }
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (result) => {
      resolve(result)
    }
    var JSONP = document.createElement('script')
    JSONP.type = 'text/javascript'
    JSONP.src = `${url}&callback=jsonCallBack`
    document.getElementsByTagName('head')[0].appendChild(JSONP)
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(JSONP)
    }, 500)
  })
}

service.jsonps = ({url, key, b}) => {
  return new Promise((resolve, reject) => {
    var j = document.getElementsByTagName("head")[0] || document.documentElement;
    var k = document.createElement("script");
    k.setAttribute("language", "javascript");
    if (b) {
      k.setAttribute("charset", b)
    }
    k.setAttribute("src", url);
    var l = false;
    k.onload = k.onreadystatechange = function () {
      if (!l && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        l = true
        k.onload = k.onreadystatechange = null
        if (j && k.parentNode) {
          j.removeChild(k)
        }
        return resolve(window[key])
      }
    }
    j.insertBefore(k, j.firstChild)
  })
}



export default service
