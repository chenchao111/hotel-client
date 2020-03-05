<template>
  <div class="index-page">
    <!-- <keep-alive> -->
    <component @tabs="handleTabChange" v-bind:is="current[active]" :active="active" @switchTab="active = 1"></component>
    <!-- </keep-alive> -->
    <!-- 底部栏 -->
    <van-tabbar style="z-index: 1000" v-model="active" active-color="#e3a952">
      <van-tabbar-item>
        <span>住宿</span>
        <img
          slot="icon"
          slot-scope="props"
          v-lazy="props.active ? icon.hotel.active : icon.hotel.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <span>商城</span>
        <img
          slot="icon"
          slot-scope="props"
          v-lazy="props.active ? icon.market.active : icon.market.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <span>订单</span>
        <img
          slot="icon"
          slot-scope="props"
          v-lazy="props.active ? icon.order.active : icon.order.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          v-lazy="props.active ? icon.my.active : icon.my.normal"
        >
      </van-tabbar-item>
    </van-tabbar>
    </div>
</template>

<script>

import unhotel from '@/assets/unhotel.png'
import hotel from '@/assets/hotel.png'
import unmarket from '@/assets/unmarket.png'
import market from '@/assets/market.png'
import unorder from '@/assets/unorder.png'
import order from '@/assets/order.png'
import unmy from '@/assets/unmy.png'
import my from '@/assets/my.png'

export default {
  // 酒店预订首页
  name: 'hotel-page',
  
  components: {
    'hotel': () => import('@/views/hotel/index'), // 住宿
    'market': () => import('@/views/market/index'), // 超市
    'order': () => import('@/views/order/index'), // 安全
    'my': () => import('@/views/my/index') // 我的
  },
  created() {
    // this.setTitle('酒店预订')
    this.$route.query && this.$route.query.active && (this.active = {
      'hotel': 0,
      'market': 1,
      'order': 2,
      'my': 3
    }[this.$route.query.active])
  },
  data () {
    return {
      current: ['hotel', 'market', 'order', 'my'],
      active: 0,
      unhotel,
      hotel,
      unmarket,
      market,
      unorder,
      order,
      unmy,
      my,
      icon: {
        hotel: {
          normal: unhotel,
          active: hotel
        },
        market: {
          normal: unmarket,
          active: market
        },
        order: {
          normal: unorder,
          active: order
        },
        my: {
          normal: unmy,
          active: my
        }
      }
    }
  },
  methods: {
   handleTabChange(num) {
     this.active = num
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-tab {
  width: 100%;
  height: 50px;
  margin-top: 20px;
}
.index-page {
  padding-bottom: 50px;
}
</style>
