<template>
  <div class="auth-exam-page">
    <div class="ok">
      <img class="img" src="./images/ok.png" alt="">
    </div>
    <p class="desc">恭喜，您的酒店预订已经创建成功<br>
    您的申请信息将在1个工作日内审核完成</p>
    <p @click="beginClick" class="begin-btn">开始管理店铺</p>
  </div>
</template>

<script>

export default {
  name: 'auth-exam-page',
  created() {
    // 设置title
    // this.setTitle('审核中')
  },
  data () {
    return {
    }
  },
  methods: {
    beginClick() {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth-exam-page {
  width: 100%;
  height: 100%;
}
.ok {
  width: 84px;
  height: 84px;
  margin: 94px auto 32px;
  border-radius: 50%;
  background-image: linear-gradient(-131deg, #ECCC83 0%, #E3A851 80%);
  box-shadow: 0 3px 5px 0 rgba(195,162,72,0.37);
}
.img {
  width: 84px;
  height: 84px;
}
.desc {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  line-height: 24px;
}
.begin-btn {
  width: 345px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background-image: linear-gradient(-131deg, #ECCC83 0%, #E3A851 80%);
  box-shadow: 0 3px 5px 0 rgba(195,162,72,0.37);
  border-radius: 22px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0.28px;
  margin: 250px auto 0;
}
</style>
