<template>
  <div class="auth-name-page">
    <!-- 头像区域 -->
    <div class="head-img-info">
      <form class="mt-30" ref='upHead' action='//up1.jrj.com.cn/upload' method='post' target='uploadimgw_1' enctype='multipart/form-data'>
        <input type="hidden" name="sizeMax" id="sizeMax" value="10485760">
        <input type="hidden" name="channel" id="channel" value="editor_upload">
        <input type="hidden" name="returnUrl" id="returnUrl_normal" :value='uploadURL'>
        <input type="hidden" id="cardPath" value="1">
        <van-uploader name='filename' accept="image/jpg, image/png" :before-read="onReadBefore" :after-read="onReadHead" :max-size="1024 * 1024 * 10" @oversize="oversize">
          <img class="head-img" v-if="headImg" v-lazy="headImg" alt="">
          <img class="head-img" v-else src="./images/head.png" alt="">
          <p class="mt-15 edit-head-desc">编辑店主头像</p>
        </van-uploader>
      </form>
      <iframe frameborder="0" scrolling="no" width="0" height="0" ref='uploadimgw_1' name="uploadimgw_1" id="uploadimgw_1" target="_self" style='display:none;'></iframe>
    </div>
    <!-- 邀请码 -->
    <div style="margin-top: 35px;" v-show="showCode">
      <p class="name-desc">邀请码（必填）</p>
      <van-field class="van-hairline--surround name-input" v-model="code" placeholder="请输入邀请码"/>
    </div>
    <p v-show="showCode" class="code-desc mt-10">无邀请码，可以添加微信“cc18519312420”，获取价值399元店铺邀请码</p>
    <!-- 姓名 -->
    <div>
      <p class="name-desc" style="margin-top: 9px;">真实姓名（必填）</p>
      <van-field class="van-hairline--surround name-input" v-model="name" placeholder="请输入真实姓名" :disabled="isName"/>
    </div>
    <!-- 身份证 -->
    <div style="margin-top: 9px;">
      <p class="name-desc">身份证号码（必填）</p>
      <van-field class="van-hairline--surround name-input" v-model="card" placeholder="请输入身份证号码" :disabled="isCard"/>
    </div>

    <!-- 上传区域 -->
    <!-- <div style="margin-top: 29px; position: relative;">
      <p v-show="!isCardSuccess" class="error-desc">请输入正确身份证号</p>
      <p class="name-desc">手持身份证</p>
       <form ref='upCard' action='//up1.jrj.com.cn/upload' method='post' target='uploadimgw_1' enctype='multipart/form-data'>
          <input type="hidden" name="sizeMax" id="sizeMax" value="10485760">
          <input type="hidden" name="channel" id="channel" value="editor_upload">
          <input type="hidden" name="returnUrl" id="returnUrl_normal" :value='uploadURL'>
          <input type="hidden" id="cardPath" value="1">
          <van-uploader class="border" name='filename' accept="image/jpg, image/png" :before-read="beforeRead" :after-read="onRead">
            <img class="identityImage" v-if="cardImage" v-lazy="cardImage" alt="">
            <p v-else>+  上传身份证</p>
          </van-uploader>
        </form>
        <iframe frameborder="0" scrolling="no" width="0" height="0" ref='uploadimgw_1' name="uploadimgw_1" id="uploadimgw_1" target="_self" style='display:none;'></iframe>
    </div> -->
    <!-- 提示区域 -->
    <!-- <div class="mt-20 flex-p">
      <img class="card-img flex-c-0" src="./images/card.png" alt="">
      <p class="desc flex-c-1">
        保持头像、身份证信息清晰可见<br>
        仅支持10M以内的jpg、png格式图片
      </p>
    </div> -->
    <!-- 下一步 -->
    <!-- <div @click="nextClick" v-if="isCardOk === true && isNameOk === true && cardImage.length > 0 && code.length > 0 && headImg.length > 0" :class="['btn', 'next-btn-active']">下一步</div> -->
    <div @click="nextClick" v-if="name.length > 0 && card.length > 0 && code.length > 0 && headImg.length > 0 && !isLock" :class="['btn', 'next-btn-active']">提交审核</div>
    <div v-else :class="['btn', 'next-btn']">提交审核</div>
  </div>
</template>

// <script>
// import { queryUserInfo, commitAudit, commitIntelligence, checkCardWithName, getBasicUserInfo2, checkIsVerified, pushIdentity, queryWechatUserInfo } from '@/api/login'
// import { queryCanUserCode } from '@/api/home/partner'
// import { cardCheck } from '@/utils/utils'

// export default {
//   name: 'auth-name-page',
//   created() {
//     // 设置title
//     // this.setTitle('实名认证')

//     // 设置同源
//     try {
//       document.domain = 'jrj.com.cn'
//     } catch (e) {
//       void 0
//     }

//     window.onUpload = (url) => { // 头像图片上传后的回调
//       this.headImg = url
//       console.log('headImg: ')
//       console.log(this.headImg)
//     }

//     // 获取用户已经提交的信息
//     this.getUserInfo()
//   },
//   data () {
//     return {
//       showCode: true,
//       isLock: false,
//       cardImage: '', // 身份证
//       headImg: '', // 头像
//       uploadURL: `${window.location.protocol}//itougu.jrj.com.cn/account/uploadImgV2.jspa`,
//       maxSize: 1024 * 10,
//       code: '', // 邀请码
//       isCode: false,
//       name: '', // 真实姓名
//       isName: false,
//       card: '', // 身份证号
//       isCard: false,
//       intro: '', // 简介
//       isNameOk: false,
//       isCardOk: false,
//       isCardSuccess: true // 身份验证是否通过
//     }
//   },
//   methods: {
//     // 获取用户已经提交的信息
//     async getUserInfo() {
//       try {
//         const tgInfo = await getBasicUserInfo2()
//         console.log('tgInfo: ' + JSON.stringify(tgInfo))

//         const res = await queryUserInfo({
//           userId: this.tgid()
//         })
//         console.log('res: ')
//         console.log(res)
//         // 初始化当前数据
//         this.headImg = res.headImage
//         this.name = res.trueName || ''
//         this.name.length && (this.isName = true)
//         this.card = res.identityId || ''
//         this.card.length && (this.isCard = true)
//         this.intro = res.intro || 'TA很懒，还没有添加个人介绍'
//         // 获取用户邀请码
//         // 1. 获取当前用户扫描二维码绑定的对应tgid
//         const userInfo = await queryWechatUserInfo({
//           openid: this.openId()
//         })
//         if (userInfo.channel) { // 是扫描进入的
//           // 2. 根据tgid查询可用邀请码
//           const code = await queryCanUserCode({
//             userId: userInfo.channel
//           })
//           if (code) { // 有可用邀请码 不显示
//             this.code = code
//             this.showCode = false
//           } else { // 无可用邀请码 显示
//             this.code = ''
//             this.showCode = true
//             // this.$notify('TA的邀请数量已用完，请您获取邀请码再开通店铺')
//             this.$dialog.alert({
//               showCancelButton: false,
//               message: 'TA的邀请数量已用完，请您获取邀请码再开通店铺'
//             })
//           }
//         } else {
//           this.code = res.code || ''
//           this.showCode = this.code.length ? false : true
//           // this.code.length && (this.isCode = true)
//         }
//       } catch (error) {
//         console.log('失败')
//         console.log(error)
//         if (parseInt(error.retCode) === -1001 || parseInt(error.retCode) === -1002) { // 审核已经通过
//           const res = error.data
//           // 初始化当前数据
//           this.headImg = res.headImage
//           this.name = res.trueName || ''
//           this.name.length && (this.isName = true)
//           this.card = res.identityId || ''
//           this.card.length && (this.isCard = true)
//           this.intro = res.intro || 'TA很懒，还没有添加个人介绍'
//           // 获取用户邀请码
//         // 1. 获取当前用户扫描二维码绑定的对应tgid
//         const userInfo = await queryWechatUserInfo({
//           openid: this.openId()
//         })
//         console.log('userInfo')
//         console.log(userInfo)
//         if (Object.keys(userInfo).length) { // 是扫描进入的
//           // 2. 根据tgid查询可用邀请码
//           const code = await queryCanUserCode({
//             userId: userInfo.channel
//           })
//           if (code) { // 有可用邀请码 不显示
//             this.code = code
//             this.showCode = false
//           } else { // 无可用邀请码 显示
//             this.code = ''
//             this.showCode = true
//             // this.$notify('TA的邀请数量已用完，请您获取邀请码再开通店铺')
//             this.$dialog.alert({
//               showCancelButton: false,
//               message: 'TA的邀请数量已用完，请您获取邀请码再开通店铺'
//             })
//           }
//         } else {
//           this.code = res.code || ''
//           this.showCode = this.code.length ? false : true
//           // this.code.length && (this.isCode = false)
//         }
//         }
//       }
//     },
//     onReadBefore(file, detail) {
//       return true
//     },
//     dataURLtoFile(dataurl, filename, path){
//       let arr = dataurl.split(',')
//       let mime = arr[0].match(/:(.*?);/)[1]
//       let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
//       while(n--){
//           u8arr[n] = bstr.charCodeAt(n);
//       }
//       return new File([u8arr], filename, {type: mime, path: path})
//     },
//     // 上传头像
//     onReadHead(file, detail) {
//       this.$refs.upHead.submit()
//     },
//     oversize() {
//       this.$notify('上传的图片大小超过10M')
//     },
//     // 下一步
//     async nextClick() {
//       if (!this.isLock) { // 未加锁
//         this.isLock = true // 加锁
//         if (!cardCheck(this.card)) { // 校验身份证号
//           // this.isCardSuccess = false
//           this.$notify('请输入正确的身份证号')
//           this.isLock = false // 解锁
//         } else {
//           try {
//             // 查看是否已经实名认证
//             const verified = await checkIsVerified()
//             console.log(verified)
//             if (parseInt(verified.bindingIdentity) === 0) { // 没有进行实名认证
//               // 进行实名认证
//               // const res = await checkCardWithName({
//               //   certificateId: this.card,
//               //   certificateName: this.name
//               // })
//               // console.log(res)
//               const res = await pushIdentity({
//                 idCard: this.card,
//                 trueName: this.name
//               })
//               console.log(res)
//             }
//             // if (parseInt(res.resultCode) === 0) { // 校验成功
//             await commitAudit({ // 提交信息
//               code: this.code,
//               headImage: this.headImg,
//               identityId: this.card,
//               intro: this.intro,
//               trueName: this.name,
//               userId: this.tgid()
//             })
//             await commitIntelligence({
//               userId: this.tgid()
//             })
//             // this.$dialog.alert({
//             //   message: '提交成功，1-3个工作日内审核！'
//             // })
//             // 跳转首页
//             this.$router.push({
//               name: 'home'
//             })
//             // this.isLock = false // 解锁
//             // } else { // 校验失败
//             //   this.$notify(res.resultMsg)
//             // }
//           } catch (error) {
//             console.warn(error)
//             this.isLock = false // 解锁
//           }
//         }
//       }
//     }
//   }
// }
// </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  color:rgba(202,202,202,1) !important;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color:rgba(202,202,202,1) !important;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:rgba(202,202,202,1) !important;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color:rgba(202,202,202,1) !important;
}
.auth-name-page {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.name-desc {
  height: 38px;
  line-height: 38px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color:rgba(102,102,102,1);
}
.name-input {
  padding: 10px 15px;
  box-sizing: border-box;
}
.border {
  width: 335px;
  height: 180px;
  line-height: 180px;
  text-align: center;
  border: 1px dotted #CDCDCD;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}
.card-img {
  width: 40px;
  height: 38px;
  margin-right: 17px;
}
.desc {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  line-height: 20px;
}
.error-desc {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #FF7545;
  letter-spacing: 0.45px;
  position: absolute;
  top: -22px;
  left: 15px;
}
.btn {
  width: 345px;
  height: 44px;
  margin: 57px auto 0;
  line-height: 44px;
  text-align: center;
  border-radius: 22px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0.28px;
}
.next-btn-active {
  background-image: linear-gradient(-131deg, #ECCC83 0%, #E3A851 80%);
  box-shadow: 0 3px 5px 0 rgba(195,162,72,0.37);
}
.next-btn {
  background-image: linear-gradient(-131deg, #E0E0E0 0%, #BDBDBD 80%);
  box-shadow: 0 3px 5px 0 rgba(145,145,145,0.37);
}
.code-desc {
  font-size: 11px;
  font-family: PingFangSC-Regular;
  font-weight:400;
  color:rgba(255,103,50,1);
}
.head-img-info {
  text-align: center;
}
.head-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.edit-head-desc {
  font-size: 14px;
  line-height: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color:rgba(51,51,51,1);
}
</style>
