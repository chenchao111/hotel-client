/* eslint-disable */

import axios from 'axios'
import crypto from 'crypto'
import store from '@/store'

const appKey = 'U2FsdGVkX18YEbHP8DVdNLmkjGBICl7Ixm41a/LemtQ='
let timer = ''
axios.defaults.timeout = 50000
axios.defaults.baseURL =''

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回信息
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的信息，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}
function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg)
  }
  if (res.data && (!res.data.success)) {
    alert(res.data.error_msg)
  }
  return res
}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data)
    console.log('拦截器token: ' + store.state.env.token)
    console.log('拦截器设备:' + localStorage.getItem('device'))
    console.log('拦截器app token:' + sessionStorage.getItem('token'))
    var device = localStorage.getItem('device')
    config.headers = {
      'Content-Type': 'application/json',
      'authorization': (device === 'wechat' ? (store.state.env.token ? store.state.env.token : '') : sessionStorage.getItem('token')),
      'channel': store.state.env.device === 'wechat' ? store.state.env.channel : ''
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config
  },
  error => {
    return Promise.reject(err)
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
// optimus.m
export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    const toast = this.$createToast({
      time: 0,
      mask: true,
      txt: '努力加载中...'
    })
    toast.show()
    let str = appKey
    let date = new Date().getTime()
    date = Math.floor(date/1000)
    let md5 = crypto.createHash('md5')
    params['_appid'] = 'optimus.m'
    params['_timestamp'] = date
    delete params._sign
    let arr = Object.keys(params).sort()
    for (let i=0;i<arr.length;i++){
      str += arr[i] + params[arr[i]]
    }
    // arr.forEach((val, index) => {
    //   str += val + params[val]
    // })
    console.log('签名: ')
    console.log(str)
    let result = md5.update(str).digest('hex')
    params['_sign'] = result
    !sessionStorage.getItem('token') && window.Hybrid.getAccessToken()
    axios.get(url,{
      params:params
    })
      .then(response => {
        console.log('返回值: ' + JSON.stringify(response))
        clearTimeout(timer)
        timer = setTimeout(() => {
          toast.hide()
        }, 600)
        if (response.data.returncode === 0) {
          resolve(response.data)
        } else if (response.data.returncode === 500) {
          const toast = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: response.data.message
          })
          toast.show()
          // if (parseInt(store.state.env.channel) === 2 || parseInt(store.state.env.channel) === 8) {
          //   this.$router.push({
          //     name: 'Wechat'
          //   })
          // } else if (parseInt(store.state.env.channel) === 7) {
          //   this.$router.push({
          //     name: 'home'
          //   })
          // }
        } else if (response.data.returncode === 10010) { // 没有登录
          let device = localStorage.getItem('device')
          console.log('设备: ' + device)
          console.log('渠道: ' + localStorage.getItem('channel'))
          if (device === 'wechat') {
            // resolve(response.data)
            // this.Page('Airport-Parking-Detail')
            // localStorage.setItem('query', this.$route.query)
            // this.$router.push({
            //   name: 'Wechat-Transfer-Page'
            // })
            if (parseInt(localStorage.getItem('channel')) === 7) {
              this.$router.push({
                name: 'Wechat-Login'
              })
            } else if (parseInt(localStorage.getItem('channel')) === 2 || parseInt(localStorage.getItem('channel')) === 8) {
              this.$router.push({
                name: 'Wechat-Transfer-Page'
              })
            }
          } else {
            // resolve(response.data)
            this.$router.go(-1)
            window.Hybrid.login()
          }
        } else if (response.data.returncode === 10104) { // 中转页
          resolve(response.data)
        } else if (response.data.returncode === 10103) { // 登录页
          resolve(response.data)
        } else if (response.data.returncode === 20001 || response.data.returncode === 20002 || response.data.returncode === 20003 || response.data.returncode === 10103 || response.data.returncode === 20004) {
          resolve(response.data)
        } else {
          // if (parseInt(store.state.env.channel) === 2 || parseInt(store.state.env.channel) === 8) {
          //   this.$router.push({
          //     name: 'Wechat'
          //   })
          // } else if (parseInt(store.state.env.channel) === 7) {
          //   this.$router.push({
          //     name: 'home'
          //   })
          // }
          const toast = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: response.data.message
          })
          toast.show()
        }
      })
      .catch(err => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          toast.hide()
          const toast01 = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: '请求超时'
          })
          toast01.show()
        }, 600)
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {},isShowToast=true){
  return new Promise((resolve,reject) => {
    const toast = this.$createToast({
      time: 0,
      mask: true,
      txt: '努力加载中...'
    })
    if(isShowToast){
      toast.show()
    }
    let str = appKey
    let obj = {}
    let date = new Date().getTime()
    date = Math.floor(date/1000)
    let md5 = crypto.createHash('md5')
    if (url.indexOf('?') > 0) {
      obj['_appid'] = 'optimus.m'
      obj['_timestamp'] = date
      obj['_body'] = JSON.stringify(data)
      let parameter = url.split('?')[1].split('&')
      console.log(parameter)
      for (let i=0;i<parameter.length;i++){
        let key = parameter[i].split('=')[0]
        let value = parameter[i].split('=')[1]
        obj[key] = value
      }
      // parameter.forEach((val, index) => {
      //   let key = val.split('=')[0]
      //   let value = val.split('=')[1]
      //   obj[key] = value
      // })
      let arr = Object.keys(obj).sort()
      for (let i = 0; i < arr.length; i++) {
        str += arr[i] + obj[arr[i]]
      }
      // arr.forEach((val, index) => {
      //   str += val + obj[val]
      // })
      console.log(str)
      let result = md5.update(str).digest('hex')
      url = url+'&_appid=optimus.m&_timestamp='+date+'&_sign='+result
    } else {
      obj['_body'] = JSON.stringify(data)
      obj['_appid'] = 'optimus.m'
      obj['_timestamp'] = date
      let arr = Object.keys(obj).sort()
      for (let i = 0; i < arr.length; i++) {
        str += arr[i] + obj[arr[i]]
      }
      // arr.forEach((val, index) => {
      //   str += val + obj[val]
      // })
      console.log(str)
      let result = md5.update(str).digest('hex')
      url = url+'?_appid=optimus.m&_timestamp='+date+'&_sign='+result
    }
    !sessionStorage.getItem('token') && window.Hybrid.getAccessToken()
    axios.post(url ,data)
      .then(response => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          toast.hide()
        }, 600)
        if (response.data.returncode === 0) {
          resolve(response.data)
        } else if (response.data.returncode === 500) {
          const toast = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: response.data.message
          })
          toast.show()
          // if (parseInt(store.state.env.channel) === 2 || parseInt(store.state.env.channel) === 8) {
          //   this.$router.push({
          //     name: 'Wechat'
          //   })
          // } else if (parseInt(store.state.env.channel) === 7) {
          //   this.$router.push({
          //     name: 'home'
          //   })
          // }
        } else if (response.data.returncode === 10010) { // 没有登录
          let device = localStorage.getItem('device')
          console.log('设备: ' + device)
          console.log('渠道: ' + localStorage.getItem('channel'))
          if (device === 'wechat') {
            // resolve(response.data)
            // this.Page('Airport-Parking-Detail')
            // localStorage.setItem('query', this.$route.query)
            // this.$router.push({
            //   name: 'Wechat-Transfer-Page'
            // })
            if (parseInt(localStorage.getItem('channel')) === 7) {
              this.$router.push({
                name: 'Wechat-Login'
              })
            } else if (parseInt(localStorage.getItem('channel')) === 2 || parseInt(localStorage.getItem('channel')) === 8) {
              this.$router.push({
                name: 'Wechat-Transfer-Page'
              })
            }
          } else {
            // resolve(response.data)
            this.$router.go(-1)
            window.Hybrid.login()
          }
        } else if (response.data.returncode === 10104) { // 中转页
          resolve(response.data)
        } else if (response.data.returncode === 10103) { // 登录页
          resolve(response.data)
        } else if (response.data.returncode === 20001 || response.data.returncode === 20002 || response.data.returncode === 20003 || response.data.returncode === 10103 || response.data.returncode === 20004) {
          resolve(response.data)
        } else {
          // if (parseInt(store.state.env.channel) === 2 || parseInt(store.state.env.channel) === 8) {
          //   this.$router.push({
          //     name: 'Wechat'
          //   })
          // } else if (parseInt(store.state.env.channel) === 7) {
          //   this.$router.push({
          //     name: 'home'
          //   })
          // }

          const toast = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: response.data.message
          })
        }
      },err => {
        toast.show()
        clearTimeout(timer)
        timer = setTimeout(() => {
          toast.hide()
          const toast01 = this.$createToast({
            type: 'warn',
            time: 3000,
            txt: '请求超时'
          })
          toast01.show()
        }, 600)
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}
