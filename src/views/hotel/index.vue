<template>
  <div class="home-page">
    <van-popup v-model="showDetail" position="bottom" :style="{ height: '80%' }" closeable get-container="body">
      <div class="content">
        <!-- <van-icon class="close" name="cross" size="25" @click="showDetail = false"/> -->
        <div @click="handlePreviewRoom">
          <van-swipe @change="onChange" class="swiper-images" :stop-propagation="false">
            <van-swipe-item class="swiper-images-item" v-for="(image, index) in room.images" :key="image+index">
              <img class="swiper-image" :src="image" alt="">
            </van-swipe-item>
            <div class="custom-indicator" slot="indicator">
              {{ current + 1 }} / {{room.images ? room.images.length : 1}}
            </div>
          </van-swipe>
        </div>
        <div class="flex-p book van-hairline--top">
          <a class="phone" :href="`tel:${phone}`">
            <img class="service" src="./images/icon/service.png" alt="">
            <p>咨询酒店</p>
          </a>
          <div class="right-book-btn flex-p">
            <span class="sign">¥</span>
            {{room.price}}
            <div @click="handleBuyClick(room.isCheck, room.id)" :class="['book-btn', room.isCheck ? 'checked' : '']">{{room.isCheck ? '已预订' : '预订'}}</div>
          </div>
        </div>
        <div class="room-desc van-hairline--top">
          <p class="icon-list" v-for="({img, desc}, index) in room.traits" :key="desc+index">
            <img class="icon" :src="img" alt="">
            {{desc}}
          </p>
        </div>
        <div class="room-introduce van-hairline--top">
          <div class="desc-list flex-p" v-for="({title, desc}, index) in room.assorts" :key="title+index">
            <p class="title">{{title}}</p>
            <p class="desc">{{desc}}</p>
          </div>
        </div>
        <div class="room-rule van-hairline--top" v-for="({title, list}, index) in room.descs" :key="title+index">
          <p class="title">{{title}}</p>
          <p class="desc flex-p" v-for="(info, index) in list" :key="info+index">
            <span class="dot"></span>
            <span>{{info}}</span>
          </p>
        </div>
      </div>
    </van-popup>
    <div class="top-img" @click="handlePreview" v-lazy:background-image="cover" >
      <p class="img-desc">
        <img class="eye" src="./images/icon/eye.png" alt="">
        <span>酒店图片</span>
        <span>2019年装修</span>
      </p>
      <div class="desc">
        <p class="van-hairline--bottom center-num">5.0</p>
        <p class="van-hairline--bottom center-desc">环境很<br/>nice啦</p>
        <p class="van-hairline--bottom top">温馨舒适</p>
        <p class="bottom">师范&联大 </p>
      </div>
    </div>
    <div class="bottom-info">
      <div class="hotel-desc van-hairline--bottom">
        <p class="title">
          <span class="title-desc">{{name}}</span>
          <span>高档型</span>
          <img class="king" src="./images/icon/king.png" alt="">
        </p>
        <div class="hotel-addr-phone">
          <p class="addr">{{location}}</p>
          <a class="phone" :href="`tel:${phone}`">
            <img class="phone-icon" src="./images/icon/phone.png" alt="">
            <p class="phone-desc">电话</p>
          </a>
        </div>
      </div>
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
      <van-collapse v-model="activeNames" class="rooms-list">
         <van-collapse-item :title="title" :name="type" v-for="({type, title, list}, index) in rooms" :key="title + index">
          <ul>
            <li class="room" @click="handleRoomDetail(id)" v-for="({id, name, type, cover, images, isCheck, price, tags, traits, assorts, descs}, index) in list" :key="name + index">
              <img class="cover" :src="cover" alt="">
              <div class="right-desc">
                <p class="title">{{name}}</p>
                <!-- <p class="desc">1层 不含早 有窗 <br>面积：10~15㎡ 大床 2人入住 </p> -->
                <p class="desc">
                  <van-tag style="margin: 4px 10px 4px 0" type="primary" plain color="#f2826a" v-for="(tag, index) in tags" :key="tag+index" v-show="index < 3">{{tag}}</van-tag>
                  <!-- <span v-for="(tag, index) in tags" :key="tag+index" v-show="index < 3">{{tag}}</span> -->
                </p>
                <p>价格: <span class="sign">¥</span> <span class="price">{{price}}</span></p>
              </div>
              <div :class='["pay", isCheck ? "unreserve" : "reserve"]' @click.stop="handleBuyClick(isCheck, id)">
                <p class="top">{{isCheck ? "已预定" : "预定"}}</p>
                <p class="bottom">在线付</p>
              </div>
            </li>
          </ul>
        </van-collapse-item>
        <!-- <van-collapse-item title="豪华大床房" name="1">
          <ul>
            <li class="room" @click="showDetail = true">
              <img class="cover" src="./images/rooms/101/cover.jpg" alt="">
              <div class="right-desc">
                <p class="title">（101）豪华大床房</p>
                <p class="desc">1层 不含早 有窗 <br>面积：10~15㎡ 大床 2人入住 </p>
                <p>价格: <span class="sign">¥</span> <span class="price">318</span></p>
              </div>
              <div class="pay reserve">
                <p class="top">预定</p>
                <p class="bottom">在线付</p>
              </div>
            </li>
             <li class="room">
              <img class="cover" src="./images/rooms/102/cover.jpg" alt="">
              <div class="right-desc">
                <p class="title">（102）豪华大床房</p>
                <p class="desc">1层 不含早 有窗 <br>面积：10~15㎡ 大床 2人入住 </p>
                <p>价格: <span class="sign">¥</span> <span class="price">318</span></p>
              </div>
              <div class="pay unreserve">
                <p class="top">已预定</p>
                <p class="bottom">在线付</p>
              </div>
            </li>
          </ul>
        </van-collapse-item> -->
        <!-- <van-collapse-item title="标准大床房" name="2">内容</van-collapse-item>
        <van-collapse-item title="双人/多人标间" name="3">内容</van-collapse-item>
        <van-collapse-item title="豪华单人间" name="4">内容</van-collapse-item>
        <van-collapse-item title="标准单人间" name="4">内容</van-collapse-item> -->
      </van-collapse>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { ImagePreview } from 'vant';

Vue.use(ImagePreview);
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

import { getDateStr, formatDate, weekDay, getDaysBetween } from '@/utils/date'

export default {
  name: 'home-page',
  filters: {
    dateFilter(value) {
      return value ? value.split('年')[1] : ""
    }
  },
  mounted () {
    this.init()
    const date = {
      start: formatDate(getDateStr(0)),
      startWeek: weekDay(getDateStr(0)),
      end: formatDate(getDateStr(1)),
      endWeek: weekDay(getDateStr(1)),
      day: getDaysBetween(getDateStr(0), getDateStr(1))
    }
    console.log('date: ', date)
    this.set_date({date})
  },
  data () {
    return {
      // date: {
      //   start: formatDate(getDateStr(0)),
      //   startWeek: weekDay(getDateStr(0)),
      //   end: formatDate(getDateStr(1)),
      //   endWeek: weekDay(getDateStr(1)),
      //   day: getDaysBetween(getDateStr(0), getDateStr(1))
      // },
      show: false,
      activeNames: [1, 2, 3, 4, 5],
      showDetail: false,
      current: 0
    }
  },
  computed: {
     ...mapGetters([
      'name',
      'images',
      'location',
      'phone',
      'cover',
      'rooms',
      'room',
      'date'
    ])
  },
  methods: {
    ...mapActions('hotel', [
      'queryHotelInfo',
      'queryRoomsInfo',
      'queryRoomInfo'
    ]),
    ...mapMutations('hotel', [
      'set_date'
    ]),
    async init() {
      try {
        const hotel = await this.queryHotelInfo()
        const rooms = await this.queryRoomsInfo()
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
    onChange(index) {
      this.current = index;
    },
    handlePreview() {
      ImagePreview(this.images)
    },
    handlePreviewRoom() {
      ImagePreview([
        require('./images/rooms/101/room/1.jpg'),
        require('./images/rooms/101/room/2.jpg'),
        require('./images/rooms/101/room/3.jpg'),
        require('./images/rooms/101/room/4.jpg')
      ])
    },
    handleBuyClick(isCheck, id) {
      if (isCheck) {
        this.$notify('房间已被他人预订，下次要来早点哦！');
      } else {
        this.$router.push({
          name: 'order-hotel',
          query: {
            id
          }
        })
      }
      
    },
    async handleRoomDetail(id) {
      console.log('id: ', id)
      try {
        const room = await this.queryRoomInfo({id})
        this.current = 0
        console.log('room: ', room)
        this.showDetail = true
      } catch (error) {
        console.error(error)
      }
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.top-img {
  width: 100%;
  height: 200px;
  // background: url('./images/home.jpg') 0 0 no-repeat;
  background-size: cover;
  position: relative;
  .desc {
    position: absolute;
    left: 10px;
    bottom: 20px;
    width: 60px;
    padding: 2px 5px;
    background-color: rgba(18, 20, 19, .5);
    // color: #fff;
    color: #ffc094;
    text-align: center;
    font-size: 10px;
    border-radius: 3px;
    p {
      padding: 5px 0;
    }
    .center-num {
      font-size: 20px;
    }
  }
  .img-desc {
    color: #fff;
    position: absolute;
    right: 10px;
    bottom: 20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    span, img {
      padding: 0 3px;
    }
    .eye {
      width: 12px;
      height: 12px;
    }
  } 
}
.content {
  position: relative;
  padding-bottom: 50px;
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
  }
  .swiper-images {
    width: 100%;
    height: 200px;
    .swiper-images-item {
      background-color: burlywood;
      position: relative;
      .swiper-image {
        width: 100%;
        height: 100%;
      }
    }
    .custom-indicator {
      width: 35px;
      height: 20px;
      line-height: 20px;
      background-color: rgba(86, 55, 26, .4);
      position: absolute;
      right: 20px;
      bottom: 20px;
      color: #fff;
      text-align: center;
      border-radius: 10px;
    }
  }
  .room-desc {
    padding: 10px;
    box-sizing: border-box;
    .icon-list {
      width: 30%;
      font-size: 12px;
      display: inline-block;
      height: 30px;
      line-height: 20px;
      padding: 5px 0;
      box-sizing: border-box;
      .icon {
        width: 18px;
        height: 18px;
      }
    }
  }
  .room-introduce {
    padding: 10px;
    .desc-list {
      line-height: 20px;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-top: 10px;
      .title {
        font-size: 14px;
        width: 80px;
        color: #515151;
      }
      .desc {
        width: calc(100% - 80px);
      }
    }
  }
  .room-rule {
    padding: 15px;
    box-sizing: border-box;
    font-size: 12px;
    color: #515151;
    .title {
      font-size: 20px;
      color: #000;
      margin-bottom: 10px;
    }
    .desc {
      line-height: 20px;
      .dot {
        width: 3px;
        height: 3px;
        margin: 8px 8px;
        background-color: #ccc;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .book {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    padding: 10px 10px;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    background: #fff;
    z-index: 1000;
    box-shadow: 0px 0px 3px rgba(81, 81, 81, .5);
    .phone {
      text-align: center;
      color: #515151;
    }
    .service {
      width: 20px;
      height: 20px;
    }
    .right-book-btn {
      color: #fe5455;
      font-size: 16px;
      line-height: 30px;
      margin-left: auto;
      .sign {
        font-size: 10px;
        line-height: 30px;
      }
      .book-btn {
        width: 100px;
        height: 30px;
        text-align: center;
        color: #fff;
        background-color: #fe5455;
        border-radius: 5px;
        font-size: 14px;
        line-height: 30px;
        margin-left: 20px;
      }
      .checked {
        background-color: #ccc;
      }
    }
  }
}
.bottom-info {
  width: 100%;
  height: 100%;
  padding: 15px 0;
  box-sizing: border-box;
  .hotel-desc {
    padding: 0 15px 20px;
    box-sizing: border-box;
    .title {
      font-size: 11px;
      color: #000;
      font-weight: bold;
      .title-desc {
        font-size: 14px;
      }
      .king {
        width: 15px;
        height: 15px;
      }
    }
    .hotel-addr-phone {
      padding-top: 10px;
      display: flex;
      flex-flow: row nowrap;
      color: #515151;
      .addr {
        line-height: 20px;
        width: 75%;
        line-height: 25px;
      }
      .phone {
        margin-left: auto;
        width: 50px;
        padding-left: 10px;
        text-align: center;
        border-left: 1px solid #ccc;
        color: #515151;
      }
      .phone-icon {
        width: 25px;
        height: 25px;
      }
      .phone-desc {
        padding-top: 5px;
      }
    }
  }
  .hotel-date {
    padding: 0 15px;
    box-sizing: border-box;
  }
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
  .rooms-list {
    margin-top: 10px;
    .room {
      height: 80px;
      display: flex;
      flex-flow: row nowrap;
      font-size: 10px;
      align-items: center;
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
      .cover {
        width: 80px;
        height: 65px;
      }
      .right-desc {
        padding-left: 10px;
        .title {
          font-size: 14px;
          color: #000;
        }
        .desc {
          // line-height: 25px;
        }
        .sign {
          color: red;
        }
        .price {
          color: red;
          font-size: 16px;
        }
      }
      .pay {
        width: 60px;
        height: 50px;
        text-align: center;
        border-radius: 5px;
        margin-left: auto;
        .top {
          height: 30px;
          line-height: 30px;
          color: #fff;
          border-radius: 5px 5px 0 0;
          font-size: 14px;
        }
        .bottom {
          height: 20px;
          line-height: 20px;
          color: #fe5455;
          font-size: 10px;
        }
      }
      .reserve {
        border: 1px solid #fe5455;
        .top {
          background-color: #fe5455;
        }
      }
      .unreserve {
        border: 1px solid #ccc;
        .top {
          background-color: #ccc;
        }
        .bottom {
          color: #ccc;
        }
      }
    }
  }
}
</style>
