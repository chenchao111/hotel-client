<template>
  <div class="order-hotel-page">
    <div class="header-desc">
      <div class="header-info">
        <div class="hotel-date van-hairline--top-bottom">
          <div class="date-choose" @click="show = true">
            <p>
              <span>{{date.start | dateFilter}}</span>
              <span class="week">{{date.startWeek}}入住</span>
            </p>
            <p class="week night">{{date.day}}晚</p>
            <p>
              <span>{{date.end | dateFilter}}</span>
              <span class="week">{{date.endWeek}}离店</span>
            </p>
          </div>
          <van-calendar v-model="show" type="range" @confirm="onConfirm" color="#e3a952"/>
        </div>
        <div class="room-info">
          <p class="title">{{room.name}}（共计{{date.day}}晚）</p>
          <p class="desc">
            <van-tag style="margin: 4px 15px 4px 10px" type="primary" plain color="#f2826a" v-for="(tag, index) in room.tags" :key="tag+index" v-show="index < 5">{{tag}}</van-tag>
          </p>
        </div>
      </div>
    </div>
    <div class="client-info-list">
      <van-cell-group>
        <van-field readonly label-width="120" label-class="label" label="房间数量" size="large" value="1 间" placeholder="请输入用户名"/>
        <van-field label-width="120" label-class="label" label="住客姓名" size="large" v-model="name" placeholder="请输入住户姓名" required clearable/>
        <van-field label-width="120" label-class="label" label="身份证号" size="large" v-model="card" placeholder="请输入身份证号" clearable/>
        <van-field label-width="120" label-class="label" label="联系电话" size="large" v-model="tel" placeholder="请输入联系电话" required clearable/>
      </van-cell-group>
    </div>
    <div class="buy-btn flex-p van-hairline--top-bottom">
      <p class="left">合计：<span class="mark">¥</span><span class="integer">{{total | integer}}</span><span class="decimals">.{{total | decimals}}</span></p>
      <p class="right" @click="handleBuy">提交订单</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

import { getDateStr, formatDate, weekDay, getDaysBetween } from '@/utils/date'

export default {
  name: 'order-hotel-page',
  created() {
    const { id } = this.$route.query
    this.init(id)
  },
  filters: {
    integer(value) {
      return value.split('.')[0]
    },
    decimals(value) {
      return value.split('.')[1]
    },
    dateFilter(value) {
      return value ? value.split('年')[1] : ""
    }
  },
  data () {
    return {
      show: false,
      name: '',
      card: '',
      tel: ''
    }
  },
  computed: {
     ...mapGetters([
      'date',
      'room',
      'user'
    ]),
    total() {
      const { day } = this.date
      const { price } = this.room
      return parseFloat(Number(day) * Number(price)).toFixed(2) + ''
    }
  },
  methods: {
    ...mapMutations('hotel', [
      'set_date'
    ]),
    ...mapActions('hotel', [
      'queryRoomInfo',
    ]),
    ...mapActions('user', [
      'queryUserInfo',
      'editUserContact',
      'createUserOrder'
    ]),
    async init(id) {
      console.log('id: ', id)
      try {
        // 获取房间信息
        const room = await this.queryRoomInfo({id})
        // 获取用户信息
        const { contacts: { name = '', tel = '', card = ''}} = await this.queryUserInfo({
          appid: this.appid
        })
        this.name = name
        this.tel = tel
        this.card = card
      } catch (error) {
        console.error(error)
      }
    },
    onConfirm(date) {
      console.log('date: ', date)
      const [start, end] = date
      console.log('start: ', start)
      console.log('end: ', end)
      this.show = false
      const d = {
        start: formatDate(start),
        startWeek: weekDay(start),
        end: formatDate(end),
        endWeek: weekDay(end),
        day: getDaysBetween(start, end)
      }
      console.log('d: ', d)
      this.set_date({date: d})
      // this.date = `${this.formatDate(start)}入住 - ${this.formatDate(end)}离店`;
    },
    async handleBuy() {
      try {
        const { name, tel, card } = this
        if (!name.length) {
          this.notify('请填写姓名')
          return
        }
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(tel)) {
          this.notify('请填写正确的手机号')
          return
        }
        // 修改常驻联系人信息 + 创建订单
        const { day, start, end } = this.date
        const { price, id, name: title, typeDesc, cover } = this.room
        const { total } = this
        console.log('total: ', total)
        const user = await this.createUserOrder({
          contacts: {
            name, tel, card
          },
          order: {
            title,
            img: cover,
            desc: typeDesc,
            start,
            end,
            day,
            price,
            total,
            room: id
          }
        })
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
.header-desc {
  width: 100%;
  height: 170px;
  padding: 15px;
  box-sizing: border-box;
  background-color: #ff5452;
  .header-info {
    width: 100%;
    height: 140px;
    background-color: #fff;
    border-radius: 10px;
  }
  .hotel-date {
    padding: 0 15px;
    box-sizing: border-box;
    .date-choose {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .week {
        font-size: 12px;
        color: #515151;
      }
      .night {
        font-size: 14px;
        padding: 0 20px;
        margin: 10px 10px;
        color: #e3a952;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
        border-radius: 10px;
      }
    }
  }
  .room-info {
    .title {
      font-size: 16px;
      line-height: 40px;
    }
    .desc {
      margin-top: 5px;
    }
  }
}
.client-info-list {
  .client-info {
    height: 50px;
  }
}
.buy-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  .left {
    width: 50%;
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    .money {
      color: #ff5555;
      font-weight: bold;
    }
    .mark {
      font-size: 12px;
      padding-right: 2px;
      .money;
    }
    .integer {
      font-size: 20px;
      .money;
    }
    .decimals {
      font-size: 12px;
      .money;
    }
  }
  .right {
    width: 50%;
    text-align: center;
    background-color: #ff5555;
    color: #fff;
  }
}
</style>
