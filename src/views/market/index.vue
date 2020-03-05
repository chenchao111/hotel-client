<template>
  <div class="market-page">
    <van-popup class="buy-car-list" v-model="isShowCar" position="bottom" :style="{ 'max-height': '60%' }">
      <van-card
        v-for="({image, title, desc, price, isBuy}, index) in cars"
        :key="title+index+index"
        class="van-hairline--bottom shop-list"
        :price="parseFloat(price).toFixed(2)"
        :title="title"
        :thumb="image"
      >
        <div slot="footer">
          <van-stepper v-model="cars[index].value" integer min="0" @change="handleCarStepChange(cars[index])"/>
        </div>
      </van-card>
    </van-popup>
    <van-collapse v-model="activeNames">
      <van-collapse-item :name="type" v-for="({type, img, title, list}, index) in foods" :key="title+index">
        <div slot="title" class="title">
          <img :src="img" alt="">
          <span>{{title}}</span>
        </div>
        <van-card
          v-for="({image, title, desc, price, isBuy}, index) in list"
          :key="title+index"
          class="van-hairline--bottom shop-list"
          :price="parseFloat(price).toFixed(2)"
          :desc="desc"
          :title="title"
          :thumb="image"
        >
          <div slot="footer">
            <van-stepper v-model="list[index].value" integer min="0" @change="handleStepChange(list[index])"/>
          </div>
        </van-card>
        <!-- <van-card
          class="van-hairline--bottom"
          price="2.00"
          desc="描述信息"
          title="商品标题"
          thumb="https://img.yzcdn.cn/vant/apple-1.jpg"
        >
          <div slot="footer">
            <van-stepper v-model="value" integer min="0"/>
          </div>
        </van-card> -->
      </van-collapse-item>
      <!-- <van-collapse-item name="2">
        <div slot="title" class="title">
          <img :src="require('../../assets/noodles.png')" alt="">
          <span>饥饿小食</span>
        </div>
        内容2
      </van-collapse-item>
      <van-collapse-item name="3">
        <div slot="title" class="title">
          <img :src="require('../../assets/health.png')" alt="">
          <span>安全用品</span>
        </div>
        内容3
      </van-collapse-item> -->
    </van-collapse>
    <van-goods-action class="buy-car">
      <!-- <van-goods-action-icon icon="chat-o" text="客服" @click="onClickIcon" /> -->
      <a :href="`tel:${phone}`" class="phone">
        <van-goods-action-icon icon="chat-o" text="客服" />
      </a>
      <van-goods-action-icon icon="cart-o" text="购物车" :info="info" @click="isShowCar = !isShowCar" />
      <!-- <van-goods-action-icon :text="`总价¥${totalPrice}`" class="total-price" /> -->
      <span class="total-price">¥<span class="total-price-num">{{totalPrice | integer }}</span>.{{totalPrice | decimals}}</span>
      <van-goods-action-button type="warning" text="修改购物车" @click="isShowCar = !isShowCar"/>
      <van-goods-action-button type="danger" text="立即购买" @click="hanleBuyClick" />
    </van-goods-action>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'market-page',
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
  computed: {
     ...mapGetters([
      'foods',
      'cars',
      'phone'
    ]),
    info() {
      const { cars } = this
      let sum = 0
      cars.forEach(food => sum += food.value)
      return sum
    },
    totalPrice() {
      const { cars } = this
      let sum = 0
      cars.forEach(({price, value}) => sum += price * value)
      return parseFloat(sum).toFixed(2)
    }
  },
  data () {
    return {
      activeNames: [1, 2, 3],
      isShowCar: false
    }
  },
  methods: {
    ...mapMutations('food', [
      'set_edit_cars',
      'set_remove_cars',
      'set_car_edit_cars'
    ]),
    ...mapActions('food', [
      'queryFoodsInfo'
    ]),
    async init() {
      try {
        const foods = await this.queryFoodsInfo()
        console.log('foods: ', foods)
      } catch (error) {
        console.error(error)
      }
    },
    handleStepChange(food) {
      console.log('执行1-----------')
      this.set_edit_cars({food})
      // if (Number(food.value) === 0) {
      //   this.set_remove_cars({food})
      // } else {
      //   this.set_edit_cars({food})
      // }
    },
    handleCarStepChange(food) {
      console.log('执行2-----------')
      this.set_car_edit_cars({food})
    },
    hanleBuyClick() {
      console.log('购买')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.market-page {
  .total-price {
    color: #fe5455;
    font-size: 12px;
    padding: 0 5px 0 10px;
    width: 50px;
    display: inline-block;
    font-weight: bold;
  }
  .total-price-num {
    font-size: 18px;
  }
  padding-bottom: 50px;
  .buy-car-list {
    bottom: 100px;
    z-index: 10 !important;
    .content {
      // max-height: 400px;
    }
  }
  .buy-car {
    z-index: 100;
  }
  .title {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    color: #e3a952;
    img {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }
  }
  .buy-car {
    bottom: 50px;
  }
}
</style>
