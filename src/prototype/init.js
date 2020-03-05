import $ from 'jquery'
import wx from 'weixin-js-sdk'
import { Notify } from 'vant'
import Misc from '@/utils/misc'
import Cookies from 'js-cookie'
import { Promise } from 'mongoose'
import { loginApi } from '@/api/index'

exports.install = function (Vue, options) {
  Vue.prototype.appid = 'wx6d8f52aae477fc08'
  Vue.prototype.shareURL = async function(url, callback) {
    try {
      const channelCode = await queryChannelCode({
        userId: this.tgid()
      })
      url = Misc.deleteUrlQuery(url)
      const ary = url.split('#')
      var suffix = ''
      var link = ''
      suffix = (url.includes('share') ? '' : ((ary[0].includes('?') ? `&` : `?`) + `share=true&tgid=${this.tgid()}&tgOpenId=${this.openId()}&channelCode=${channelCode}`))
      // link = ary[0] + suffix + '#' + ary[1]
      link = ary[0] + suffix + '#' + ary[1]
      // }
      // const link = Misc.deleteUrlQuery(url + suffix)
      // const link = url + suffix
      console.log('link: ' + link)
      callback && callback(link)
    } catch (error) {
      console.warn(error)
    }
  }
  Vue.prototype.openId = function () {
    return Cookies.get('openId')
  }
  Vue.prototype.tgInfo = function () {
    return JSON.parse(Cookies.get('tgInfo'))
  }
  Vue.prototype.wechatInfo = function () {
    console.log('this.wechatInfo().channel: ' + Cookies.get('wechatInfo'))
    return JSON.parse(Cookies.get('wechatInfo'))
  }
  // 加密
  Vue.prototype.encryption = function(str, type) {
    var crypto = require('crypto')
    var sha1 = crypto.createHash(type)
    sha1.update(str)
    return sha1.digest('hex')
  }
  // 微信分享
  Vue.prototype.wechatShare = function(options, callback) {
    console.log(JSON.stringify(options))
    $.getJSON('//wx.jrj.com.cn/api/weixin.jsp?callback=?', {
      action: 'get_ticket',
      appid: options.appid,
      rnd: Math.random()
    }, (data) => {
      var nonce = '1234567890'
      var ts = Math.round($.now() / 1000)
      var str = 'jsapi_ticket=' + data.ticket + '&noncestr=' + nonce + '&timestamp=' + ts + '&url=' + options.person.link.split('#')[0]
      var sign = this.encryption(str, 'sha1')
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: ts, // 必填，生成签名的时间戳
        nonceStr: nonce, // 必填，生成签名的随机串
        signature: sign, // 必填，签名
        // jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
        jsApiList: ['updateAppMessageShareData', 'onMenuShareTimeline', 'updateTimelineShareData', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
      })
      // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
      wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
        this.shareURL(options.person.link, function (link) {
          console.log(`link: ${link}`)
          options.person.link = link
          if (wx.onMenuShareAppMessage && wx.onMenuShareTimeline) {
            wx.onMenuShareAppMessage && wx.onMenuShareAppMessage({
              title: options.person.title, // 分享标题
              desc: options.person.desc, // 分享描述
              link: options.person.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: options.person.imgUrl, // 分享图标
              success: () => {
                // 分享成功
                Notify({
                  message: '分享成功',
                  duration: 2000,
                  background: 'rgba(255,127,42,1)'
                })
              }
            })
            wx.onMenuShareTimeline && wx.onMenuShareTimeline({
              title: options.person.title, // 分享标题
              desc: options.person.desc, // 分享描述
              link: options.person.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: options.person.imgUrl, // 分享图标
              success: () => {
                // 分享成功
                Notify({
                  message: '分享朋友圈成功',
                  duration: 2000,
                  background: 'rgba(255,127,42,1)'
                })
              }
            })
          } else {
            wx.updateAppMessageShareData && wx.updateAppMessageShareData({
              title: options.person.title, // 分享标题
              desc: options.person.desc, // 分享描述
              link: options.person.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: options.person.imgUrl, // 分享图标
              success: () => {
                // 分享成功
                Notify({
                  message: '分享成功',
                  duration: 2000,
                  background: 'rgba(255,127,42,1)'
                })
              }
            })
            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            // wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
            wx.updateTimelineShareData && wx.updateTimelineShareData({
              title: options.circle.title, // 分享标题
              link: options.circle.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: options.circle.imgUrl, // 分享图标
              success: () => {
                // 分享成功
                Notify({
                  message: '分享朋友圈成功',
                  duration: 2000,
                  background: 'rgba(255,127,42,1)'
                })
              }
            })
          }
        })
        // })
      })
    })
  }
  // 获取微信授权后url上拼接的code值
  Vue.prototype.wxCode = function() { // 获取微信授权后拼接在url上返回的code
    return Misc.getQueryString('code') || ''
  }
  // 微信授权
  Vue.prototype.authorize = async function(callback) {
    try {
      if (this.wxCode() === '') { // 授权
        var localLink = window.location.href
        console.log('--------微信授权--------')
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' +
            encodeURIComponent(localLink) +
            '&response_type=code&scope=snsapi_userinfo&state=test#wechat_redirect'
      } else { // code获取通行证账号
        console.log('--------授权完毕获取openid--------')
        const openid = await loginApi.queryOpenId({
          appid: this.appid,
          code: this.wxCode()
        })
        return Promise.resolve(openId)
      }
    } catch (error) {
      console.warn(error)
    }
  }
}
