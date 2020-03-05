<template>
  <div class="my-page">
    <div class="header-top">
      <div>
        <div class="header-img-boreder">
          <img :src="user.headimgurl" alt="">
        </div>
        <p class="nickname">{{user.nickname}}</p>
      </div>
    </div>
    <ul class="server-lsit flex-p">
      <li>
        <img class="icon" :src="require('./images/hotel.png')" alt="" @click="handleOrderClick">
        <p class="desc">酒店订单</p>
      </li>
      <li>
        <img class="icon"  :src="require('./images/shop.png')"  alt="" @click="handleOrderClick">
        <p class="desc">商城订单</p>
      </li>
      <li>
        <a class="phone" :href="`tel:${phone}`">
          <img class="icon" :src="require('./images/service.png')"  alt="">
          <p class="desc">智能客服</p>
        </a>
      </li>
    </ul>
    <van-cell-group class="query-list" @click="showEdit = true">
      <van-cell title="常住联系人" is-link icon="user-circle-o"/>
    </van-cell-group>
    <van-popup v-model="showEdit" position="bottom">
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="true"
        :tel-validator="validator"
        @save="onSave"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'my-page',
  created() {
    this.init()
  },
  data () {
    return {
      showEdit: false,
      editingContact: {}
    }
  },
  computed: {
     ...mapGetters([
      'phone',
      'user'
    ])
  },
  methods: {
    ...mapActions('hotel', [
      'queryHotelInfo'
    ]),
    ...mapActions('user', [
      'queryUserInfo',
      'editUserContact'
    ]),
    async init() {
      try {
        const hotel = await this.queryHotelInfo()
        const user = await this.queryUserInfo({
          appid: this.appid
        })
        this.editingContact = user.contacts
      } catch (error) {
        console.error(error)
      }
    },
    validator(tel) {
      const reg = /^1[3456789]\d{9}$/
      return reg.test(tel)
    },
    async onSave(info) {
      console.log('info: ', info)
      try {
        const user = await this.editUserContact(info)
        this.$notify({
          message: '创建联系人成功',
          color: '#fff',
          background: '#e3a952'
        })
        this.showEdit = false
      } catch (error) {
        console.error(error)
        this.showEdit = false
      }
    },
    handleOrderClick() {
      this.$emit('tabs', 2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.my-page {
  background-color: rgba(163, 159, 159, 0.05);
}
.header-top {
  width: 100%;
  height: 200px;
  background: url('./images/me5.jpg') 0 0 no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding-top: 50px;
  box-sizing: border-box;
  filter:alpha(opacity=80);  
  -moz-opacity:0.8;  
  -khtml-opacity: 0.8;  
  opacity: 0.8;
  .header-img-boreder {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    padding: 2px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      text-align: center;
      border-radius: 50%;
    }
  }
  .nickname {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
}
.server-lsit {
  height: 60px;
  background: #fff;
  justify-content: space-around;
  padding: 20px 0;
  text-align: center;
  .phone {
    color: #000;
  }
  .icon {
    width: 30px;
    height: 30px;
  }
  .desc {
    line-height: 40px;
  }
}
.query-list {
  margin-top: 5px;
}
</style>