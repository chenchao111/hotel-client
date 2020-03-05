<template>
  <div class="login-phone-page">
    <!-- 协议内容 -->
    <van-actionsheet v-model="agreeShow" title="《酒店预订网站用户注册协议》">
      <p v-html="common.content"></p>
    </van-actionsheet>
    <!-- 头部logo区域 -->
    <img class="logo" src="./images/logo.png" alt="">
    <!-- 中间确定内容区域 -->
    <ul class="login-info-list">
      <li class="flex-p">
        <img class="icon flex-c-0" src="./images/phone.png" alt="">
         <van-field
          ref="phone"
          @input="phoneChange"
          class="flex-c-1"
          clearable
          v-model="phone"
          placeholder="请输入手机号"
          type="tel"
        />
      </li>
      <li class="flex-p">
        <img class="icon flex-c-0" src="./images/img.png" alt="">
         <van-field
          ref="img"
          @input="imgChange"
          class="flex-c-1"
          clearable
          v-model="img"
          placeholder="请输入图形验证码"
        />
        <img ref="imgCode" @click="imgClick" class="msg-code" src="//sso.jrj.com.cn/service/create" alt="">
      </li>
      <li class="flex-p">
        <img class="icon flex-c-0" src="./images/code.png" alt="">
         <van-field
          ref="code"
          @input="codeChange"
          class="flex-c-1"
          clearable
          v-model="code"
          placeholder="请输入验证码"
          type="number"
        />
        <div @click="codeClick" :class="[isCountdown ? 'phone-code-ing' : 'phone-code']">{{info}}</div>
      </li>
      <!-- 废弃邀请码 -->
      <!-- <li class="flex-p">
        <img class="icon flex-c-0" src="./images/invite.png" alt="">
         <van-field
          ref="invite"
          @input="inviteChange"
          class="flex-c-1"
          clearable
          v-model="invite"
          placeholder="请输入邀请码"
          type="number"
        />
      </li> -->
      <!-- 手机号校验区域 -->
      <p v-show="isShowError" class="error-desc">请输入正确手机号</p>
    </ul>
    <!-- 确定按钮 -->
    <div @click="loginClick" v-if="checkPhone === true && checkCode === true && checkImg === true" :class="['success', 'login-btn']">确定</div>
    <div v-else :class="['error', 'login-btn']">确定</div>
    <p class="agree-info">点击确定，即表示阅读并同意<span @click="agreeClick" class="agree">《用户服务协议》</span></p>
  </div>
</template>

<script>
import { urlParams } from '@/utils/params'
import { checkPhone } from '@/utils/utils'
import common from '@/common/js/common'
// 获取短信验证码、确定、合并账户
import { queryMessageCode, loginPlatform, mergeWechatAndPhone, getBasicUserInfo2, queryIsOpenRoom } from '@/api/login'
import Cookies from 'js-cookie'
export default {
  name: 'login-phone-page',
  created() {
    // 设置title
    // this.setTitle('确定')

    // 获取授权跳转后的url地址参数
    this.query = urlParams(window.location.href)
  },
  data () {
    return {
      common,
      // 是否展示协议
      agreeShow: false,
      phone: '',
      checkPhone: false,
      img: '',
      checkImg: false,
      code: '',
      checkCode: false,
      invite: '',
      isShowError: false,
      info: '获取验证码',
      isCountdown: false
    }
  },
  methods: {
    // 输入手机号
    phoneChange() {
      if (this.phone.length >= 11) { // 输入11位
        this.phone = this.phone.slice(0, 11)
        if (checkPhone(this.phone)) { // 手机号验证成功
          this.$refs.img.focus()
          this.checkPhone = true
        } else { // 手机号验证失败
          this.isShowError = true
        }
      } else {
        this.checkPhone = false
        this.isShowError = false
      }
    },
    // 输入图形验证码
    imgChange() {
      if (this.img.length) {
        this.checkImg = true
      }
      // if (this.img.length >= 4) { // 输入11位
      //   this.img = this.img.slice(0, 4)
      //   this.$refs.code.focus()
      //   this.checkImg = true
      // } else {
      //   this.checkImg = false
      // }
    },
    // 点击图形验证码 切换 新的验证码
    imgClick() {
      this.$refs.imgCode.src = `//sso.jrj.com.cn/service/create?_=${Math.random()}`
    },
    // 输入验证码
    codeChange() {
      if (this.code.length >= 4) { // 输入11位
        this.code = this.code.slice(0, 4)
        // this.$refs.invite.focus()
        this.checkCode = true
      } else {
        this.checkCode = false
      }
    },
    // 输入邀请码
    // inviteChange() {

    // },
    // 获取验证码按钮点击
    codeClick() {
      if (this.checkPhone && this.checkImg) { // 手机号 和 图形验证码 验证通过
        // 获取验证码
        this.getMessageCode()
      } else {
        // this.$toast('请先输入正确的手机号和验证码')
        this.$notify('请先输入正确的手机号和图形验证码')
      }
    },
    // 获取短信验证码 + 倒计时
    async getMessageCode() {
      try {
        if (!this.isCountdown) { // 进入倒计时
          const res = await queryMessageCode({
            mobile: this.phone,
            imgCode: this.img
          })
          if (!res.resultCode) { // 验证码错误 直接结束 不进行倒计时
            this.$notify('图形验证码输入错误')
            return
          }

          // this.$toast('信息已发送')
          this.$notify({
            message: '信息已发送',
            duration: 1000,
            background: '#FF7F2A'
          })
          this.isCountdown = true // 倒计时加锁
          var count = 60
          this.timer = setInterval(() => {
            this.info = count-- + 'S'
            if (count < 0) {
              clearInterval(this.timer)
              this.isCountdown = false // 倒计时解锁
              this.info = '获取验证码'
            }
          }, 1000)
        }
      } catch (error) {
        console.warn(error)
      }
    },
    // 合并账户
    async mergeAccount(passportId) {
      try {
        const res = await mergeWechatAndPhone({
          passportId
        })
        console.log(res)
        // 种cookie
        const tgInfo = await getBasicUserInfo2()
        console.log('tgInfo: ' + JSON.stringify(tgInfo))

        // tg信息进行保存
        Cookies.set('tgInfo', JSON.stringify(tgInfo))

        const res2 = await queryIsOpenRoom({ // 检查是否开通酒店预订
          userId: tgInfo.userId
        })
        console.log(res2)
        if (parseInt(res2.status) === 1) { // 工作室审核通过直接跳首页 否则(审核中、审核未通过) 跳转实名认证
          this.$router.push({
            name: 'home'
          })
        } else { // 不存在工作室 跳转实名认证
          this.$router.push({
            name: 'auth-name'
          })
        }
        // this.$router.push({
        //   name: 'auth-name'
        // })
      } catch (error) {
        console.warn(error)
      }
    },
    // 确定按钮被点击
    async loginClick() {
      try {
        const res = await loginPlatform({
          mobile: this.phone,
          verifyCode: this.code
        })
        this.code = ''
        this.img = ''
        this.imgChange()
        this.codeChange()
        if (parseInt(res.resultCode) === 0) { // 确定成功
          console.log('确定成功')
          // setTimeout(() => {
          // 种cookie
          const tgInfo = await getBasicUserInfo2()
          console.log('tgInfo: ' + JSON.stringify(tgInfo))

          // tg信息进行保存
          Cookies.set('tgInfo', JSON.stringify(tgInfo))

          const res2 = await queryIsOpenRoom({ // 检查是否开通酒店预订
            userId: tgInfo.userId
          })
          console.log(res2)
          if (parseInt(res2.status) === 1) { // 工作室审核通过直接跳首页 否则(审核中、审核未通过) 跳转实名认证
            this.$router.push({
              name: 'home'
            })
          } else { // 不存在工作室 跳转实名认证
            this.$router.push({
              name: 'auth-name'
            })
          }
          // }, 1500)
        } else if (parseInt(res.resultCode) === 4018) { // 需要合并 通行证账号已经绑定了其他微信账户
          this.$dialog.confirm({
            message: '您的手机号已被注册，是否要将当前微信绑定到此手机账户',
            cancelButtonText: '更换手机号',
            confirmButtonText: '确认合并'
          }).then(() => {
            this.mergeAccount(res.passportId)
          })
        } else { // 其他错误原因
          this.$notify(res.resultMsg)
        }
      } catch (error) {
        console.warn(error)
      }
    },
    // 点击展示协议内容
    agreeClick() {
      this.agreeShow = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-phone-page {
  width: 100%;
  height: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.logo {
  display: block;
  width: 160px;
  height: 53px;
  margin: 74px auto 30px;
}
.icon {
  width: 14px;
  height: 18px;
  padding: 17px 14px 17px 6px;
}
.login-info-list {
  position: relative;
}
.login-info-list li {
  position: relative;
  height: 53px;
  line-height: 53px;
  border-bottom: 1px solid rgba(235,235,235,1);
}
.phone-code {
  position: absolute;
  right: 0;
  top: 13px;
  width: 90px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background:linear-gradient(90deg,rgba(227,168,81,1),rgba(236,204,131,1));
  box-shadow:0px 3px 8px 0px rgba(204,162,115,0.4);
  border-radius: 13px;
  font-size:12px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
}
.phone-code-ing {
  position: absolute;
  right: 0;
  top: 13px;
  width: 90px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: #ccc;
  box-shadow:0px 3px 8px 0px rgba(204,162,115,0.4);
  border-radius: 13px;
  font-size:12px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(255,255,255,1);
}
.error-desc {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color:rgba(255,117,69,1);
  position: absolute;
  bottom: -24px;
}
.login-btn {
  width: 100%;
  height: 44px;
  margin-top: 70px;
  text-align: center;
  line-height: 44px;
  font-size:17px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  border-radius: 22px;
  color:rgba(255,255,255,1);
}
.success {
  background-image: linear-gradient(-131deg, #ECCC83 0%, #E3A851 80%);
  box-shadow: 0px 3px 8px 0px rgba(204,162,115,0.4);
}
.error {
  background-image: linear-gradient(-131deg, #E0E0E0 0%, #BDBDBD 80%);
  box-shadow: 0px 3px 8px 0px rgba(204,162,115,0.4);
}
.agree-info {
  color: #999999;
  margin-top: 14px;
  text-align: center;
}
.agree {
  color: #E3A851;
}
.msg-code {
  padding: 10px;
  box-sizing: border-box;
}
</style>
