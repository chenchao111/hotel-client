<template>
  <div class="auth-cfa-page">
    <!-- 上传区域 -->
    <div>
      <p class="name-desc">{{name}}资质证书图片</p>
      <form class="flex-c-1 tr content" ref='upCard' action='//up1.jrj.com.cn/upload' method='post' target='uploadimgw_1' enctype='multipart/form-data'>
          <input type="hidden" name="sizeMax" id="sizeMax" value="10485760">
          <input type="hidden" name="channel" id="channel" value="editor_upload">
          <input type="hidden" name="returnUrl" id="returnUrl_normal" :value='uploadURL'>
          <input type="hidden" id="cardPath" value="1">
          <van-uploader class="border" name='filename' accept="image/jpg, image/png" :after-read="onRead" :max-size="1024 * 1024 * 10" @oversize="oversize">
            <img class="identityImage" v-if="url" v-lazy="url" alt="">
            <p v-else>+  上传{{name}}资质证书图片</p>
          </van-uploader>
        </form>
        <iframe frameborder="0" scrolling="no" width="0" height="0" ref='uploadimgw_1' name="uploadimgw_1" id="uploadimgw_1" target="_self" style='display:none;'></iframe>
    </div>
    <!-- 提示区域 -->
    <div class="mt-20 flex-p">
      <p class="desc flex-c-1">
        上传证书需要清晰识别证书编号<br>
        格式要求：支持.jpg .gif .png格式照片，大小不超过10M
      </p>
    </div>
    <!-- 下一步 -->
    <div v-if="url && url.length > 0" @click="nextClick" :class="['btn', 'next-btn-active']">确定</div>
    <div v-else :class="['btn', 'next-btn']">确定</div>
  </div>
</template>

<script>
import { queryCommitIntelligenceInfoFromType, commitIntelligenceInfoWithType } from '@/api/login'
export default {
  name: 'auth-cfa-page',
  created() {
    // 设置title
    // this.setTitle('资质认证')

    // 设置同源
    try {
      document.domain = 'jrj.com.cn'
    } catch (e) {
      void 0
    }

    window.onUpload = (url) => { // 头像图片上传后的回调
      this.url = url
      console.log(this.url)
    }

    // 获取Url上的type
    this.type = this.$route.query.type
    this.name = this.$route.query.name
    this.initIntelligenceInfo()
  },
  data () {
    return {
      userInfo: {},
      url: '',
      maxSize: 1024 * 10,
      uploadURL: `${window.location.protocol}//itougu.jrj.com.cn/account/uploadImgV2.jspa`
    }
  },
  methods: {
    oversize() {
      this.$notify('上传的图片大小超过10M')
    },
    onRead(file) {
      console.log('图片上传')

      this.$refs.upCard.submit()
    },
    async nextClick() {
      try {
        const res = await commitIntelligenceInfoWithType({
          loginId: this.tgid(),
          type: this.type,
          url: this.url
        })
        console.log(res)
        this.$router.push({
          name: 'auth-aptitudes'
        })
      } catch (error) {
        console.warn(error)
      }
    },
    // 获取提交信息
    async initIntelligenceInfo() {
      try {
        const res = await queryCommitIntelligenceInfoFromType({
          userId: this.tgid(),
          type: this.type
        })
        console.log(res)
        this.userInfo = (res && res[0]) || {}
        console.log('userInfo: ')
        console.log(this.userInfo)
        this.url = res.url
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth-cfa-page {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box
}
.name-desc {
  height: 70px;
  line-height: 70px;
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
.identityImage {
  width: 335px;
  height: 180px;
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

.card-info {
  height: 333px;
}
.card-title {
  height: 65px;
  line-height: 65px;
}
.next-btn {
  background-image: linear-gradient(-131deg, #E0E0E0 0%, #BDBDBD 80%);
  box-shadow: 0 3px 5px 0 rgba(145,145,145,0.37);
}
</style>
