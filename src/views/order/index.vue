<template>
  <div class="order-page">
    <p class="page-title">我的订单</p>
    <van-panel :title="title" :status="status === 0 ? '已完成' : '待支付'" class="card" v-for="({no, title, img, desc, start, end, day, total, price, createTime, status}, index) in orderHotel" :key="title+index">
      <div class="content flex-p">
        <img class="img" :src="img" alt="">
        <div class="order-desc">
          <p>{{desc}}</p>
          <p>{{start}} 至 {{end}}</p>
          <p>时长：{{day}}天</p>
          总价: &nbsp;<div class="total-price">¥<span class="total-price-num">{{total | integer }}</span>.{{total | decimals}}</div>
        </div>
      </div>
      <div slot="footer" class="flex-p continue-btn">
        <span class="time">下单时间: {{createTime | dayTime}}</span>
        <van-button class="buy-btn" size="mini" type="danger" v-show="status === 1" @click="handleBuy(no)">继续支付</van-button>
      </div>
    </van-panel>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'order-page',
  created() {
    this.init()
  },
  filters: {
    integer(value) {
      return value.split('.')[0]
    },
    decimals(value) {
      return value.split('.')[1]
    }
  },
  data () {
    return {
      active: 0
    }
  },
  computed: {
     ...mapGetters([
      'orderHotel',
      'orderShop'
    ])
  },
  methods: {
    ...mapActions('user', [
      'queryUserOrder'
    ]),
    async init() {
      try {
        const orders = await this.queryUserOrder()
        console.log('orders: ', orders)
      } catch (error) {
        console.error(error)
      }
    },
    async handleBuy() {
      try {
        alert('支付流程购买')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.order-page {
  background-color: #f8f8f8;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 60px;
  .page-title {
    font-size: 20px;
    line-height: 40px;
    margin-bottom: 10px;
  }
  .card {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 8px rgba(192, 185, 185, .3);
    margin-bottom: 20px;
    .content {
      width: 100%;
      height: 80px;
      padding: 0 15px;
      box-sizing: border-box;
      .img {
        width: 60px;
        height: 60px;
        border-radius: 5px;
      }
      .order-desc {
        margin-left: 10px;
      }
      .total-price {
        color: #fe5455;
        font-size: 12px;
        display: inline-block;
        font-weight: bold;
      }
      .total-price-num {
        font-size: 18px;
      }
    }
    .continue-btn {
      align-items: center;
      height: 30px;
      .time {
        display: inline-block;
        text-align: left;
      }
      .buy-btn {
        margin-left: auto;
        padding: 0 5px;
      }
    }
  }
}
</style>
