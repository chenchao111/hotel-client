<template>
  <div class="login-trans-page">

  </div>
</template>

<script>
import Misc from '@/utils/misc'
import { queryIsBindPhone, queryIsOpenRoom, getBasicUserInfo2 } from '@/api/login'

// import { clearCookie } from '@/utils/utils'
// import { queryIsBindPhone, getBasicUserInfo2 } from '@/api/login'

export default {
  name: 'login-trans-page',
  created() {
    // 设置title
    // this.setTitle('微信授权')

    // 授权登录
    this.initAuthorize()
  },
  data () {
    return {
    }
  },
  methods: {
    initAuthorize() {
      if (Misc.getQueryString('code')) {
        console.log('code: ' + Misc.getQueryString('code'))
        this.checkIsBindPhone()
      } else {
        console.log(`window.location.href: ${window.location.href}`)
        window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + encodeURIComponent(`https://c.jrj.com.cn/hotel-client.html#/auth`) + '&' + 'response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect')
      }
    },
    // 检查手机号是否绑定
    async checkIsBindPhone() {
      try {
        const res1 = await queryIsBindPhone({ // 检查手机号是否绑定
          code: Misc.getQueryString('code'),
          appid: this.appid
        })
        console.log(res1)
        // 1：绑定手机号 ==> 判断 是否存在工作室
        // 2：未绑定手机号、未绑定sso账户 ==> 手机号登录页面
        // 3：报错
        if (res1.mobile) { // 已经绑定了手机号(未绑定 进行当前的手机号绑定)
          console.log('1：绑定手机号 ==> 判断 是否存在工作室')
          // 种cookie
          const tgInfo = await getBasicUserInfo2()
          console.log('tgInfo: ' + JSON.stringify(tgInfo))

          const res2 = await queryIsOpenRoom({ // 检查是否开通酒店预订
            userId: tgInfo.userId
          })
          console.log(res2)

          if (parseInt(res2.status) === 1) { // 工作室审核通过直接跳首页 否则(审核中、审核未通过) 跳转实名认证
            console.log('1：存在工作室')
            window.location.href = `https://c.jrj.com.cn/v.html?tgid=${this.tgid()}#!/`
          } else { // 不存在工作室 跳转中台首页
            // 不能使用router 因为code会带过去 导致code重复使用
            window.location.href = `https://c.jrj.com.cn/hotel-client.html`
          }
        } else if (parseInt(res1.resultCode) === 4016 || !res1.mobile) { // 未绑定sso账号 或者 绑定了sso账号但是没绑定手机号
          // 不能使用router 因为code会带过去 导致code重复使用
          window.location.href = `https://c.jrj.com.cn/hotel-client.html`
        } else { // 其他报错
          this.$notify(res1.resultMsg)
        }
      } catch (error) {
        console.log('世界你好auth')
        // const url = window.location.href
        // window.location.href = `https://c.jrj.com.cn/hotel-client.html#/auth?_=${new Date()}`
        console.warn(error)

        // 种cookie
        const tgInfo = await getBasicUserInfo2()
        console.log('tgInfo: ' + JSON.stringify(tgInfo))

        const res2 = await queryIsOpenRoom({ // 检查是否开通酒店预订
          userId: tgInfo.userId
        })
        console.log(res2)

        if (parseInt(res2.status) === 1) { // 工作室审核通过直接跳首页 否则(审核中、审核未通过) 跳转实名认证
          console.log('1：存在工作室')
          window.location.href = `https://c.jrj.com.cn/v.html?tgid=${this.tgid()}#!/`
        } else { // 不存在工作室 跳转中台首页
          // 不能使用router 因为code会带过去 导致code重复使用
          window.location.href = `https://c.jrj.com.cn/hotel-client.html`
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
