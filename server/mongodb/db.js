// mongodb数据库操作库
const mongoose = require('mongoose')
// mongodb数据库连接地址
// const GB_URL = 'mongodb://localhost:27017/hotel'
const GB_URL = 'mongodb://localhost:27017/hotel'
mongoose.connect(GB_URL)
// 监听连接成功
mongoose.connection.on('connected', () => {
  console.log('mongodb connect success')
})

const models = {
  user: {
    phone: {
      type: String,
      require: false
    },
    openid: {
      type: String,
      require: false
    },
    nickname: {
      type: String,
      require: false
    },
    sex: {
      type: String,
      require: false
    },
    province: {
      type: String,
      require: false
    },
    city: {
      type: String,
      require: false
    },
    country: {
      type: String,
      require: false
    },
    headimgurl: {
      type: String,
      require: false
    },
    privilege: {
      type: Array,
      require: false
    },
    unionid: {
      type: String,
      require: false
    },
    contacts: {
      type: {},
      require: false
    },
    orderHotel: {
      type: Array,
      require: false
    },
    orderShop: {
      type: Array,
      require: false
    }
  },
  hotel: {
    // 酒店名
    name: {
      type: String,
      require: true
    },
    // 封面
    cover: {
      type: String,
      require: true
    },
    // 图片
    images: {
      type: Array,
      require: true
    },
    // 地址
    location: {
      type: String,
      require: true
    },
    // 电话
    phone: {
      type: String,
      require: true
    },
    // 所有房间的id
    rooms: {
      type: Array,
      require: true
    }
  },
  roomCategory: {
    // 房间类型 /*1: 豪华大床房 2：标准大床房 3: 标间 4: 豪华单人间 5: 标准单人间 */
    type: {
      type: Number,
      require: true
    },
    // 类型描述
    title: {
      type: String,
      require: true
    },
    // 房间列表
    list: {
      type: Array,
      require: true
    }
  },
  room: {
    // 房间id 唯一
    id: { 
      type: Number, 
      require: true 
    },
    // 房间名
    name: {
      type: String,
      require: true
    },
    // 房间类型 /*1: 豪华大床房 2：标准大床房 3: 标间 4: 豪华单人间 5: 标准单人间 */
    type: {
      type: Number,
      require: true
    },
    // 房间类型描述
    typeDesc: {
      type: String,
      require: true
    },
    // 封面
    cover: {
      type: String,
      require: true
    },
    // 房间图片
    images: {
      type: Array,
      require: true
    },
    // 是否预定
    isCheck: {
      type: Boolean,
      require: true
    },
    // 价格
    price: {
      type: Number,
      require: true
    },
    // 列表描述
    tags: {
      type: Array,
      require: true
    },
    // 特色介绍
    traits: {
      type: Array,
      require: true
    },
    assorts: {
      type: Array,
      require: true
    },
    // 描述
    descs: {
      type: Array,
      require: true
    }
  },
  foodCategory: {
    // 商品 /*1: 饮料零食 2：饥饿小食 3: 安全用品 */
    type: {
      type: Number,
      require: true
    },
    // 类型描述
    title: {
      type: String,
      require: true
    },
    img: {
      type: String,
      require: true
    },
    // 房间列表
    list: {
      type: Array,
      require: true
    }
  },
  food: {
    id: {
      type: Number, 
      require: true 
    },
    type: { 
      type: Number, 
      require: true 
    },
    image: {
      type: String,
      require: true
    },
    title: { 
      type: String,
      require: true
    },
    desc: { 
      type: String,
      require: true
    },
    price: { 
      type: Number,
      require: true
    },
    isBuy: {
      type: Boolean,
      require: true 
    }
  }
}

// 创建文档模型 类似mysql的表 mongo有文档、字段的概念
for (let model in models) {
  mongoose.model(model, new mongoose.Schema(models[model]))
}

module.exports = {
  getModel: (name) => {
    return mongoose.model(name)
  }
}