var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express()

const { getModel } = require('./mongodb/db')
const utils = require('./utils')
const { sha1, requestGet, requestPost } = utils

const Hotel = getModel('hotel')
const Room = getModel('room')
const RoomCategory = getModel('roomCategory')
const Food = getModel('food')
const FoodCategory = getModel('foodCategory')
const User = getModel('user')

var prefix = 'https://api.weixin.qq.com';
var appid = "wx6d8f52aae477fc08";
var appsecret = "05688f5ca785fa755fe7862bd2c02f24";

var tokenResult = null;
var jsapiTicketResult = null;
var menu = {
  "button" : [
    {
      "type" : "view",
      "name" : "师范大学",
      "url" : "http://sl.jiangedev.com/project/hotel/hotel-client.html"
    },
    {
      "type" : "view",
      "name" : "联合大学",
      "url" : "http://sl.jiangedev.com/project/hotel/hotel-client.html"
    }, 
    {

      "type" : "view",
      "name" : "酒店预定",
      "url" : "http://sl.jiangedev.com/project/hotel/hotel-client.html"
    }
  ]
}
async function initInfo() {
  try {
    var urlToken = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret;

    tokenResult = JSON.parse(await requestGet(urlToken))

    console.log('tokenResult: ')
    console.log(tokenResult)

    var urlJsapiTicket = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + tokenResult.access_token + '&type=jsapi';

    jsapiTicketResult = JSON.parse(await requestGet(urlJsapiTicket))

    const menuUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${tokenResult.access_token}`

    const muneResult = await requestPost(menuUrl, JSON.stringify(menu))

    console.log('jsapiTicketResult: ')
    console.log(jsapiTicketResult)
    console.log('muneResult: ', muneResult)
  } catch (error) {
    console.warn(error)
  }
}
initInfo()

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '..')))

// 跨域
app.use('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
  //res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); //设置方法
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  } else {
    next();
  }
})

/**---------------------------微信公众号相关接口------------------- */
// 微信服务器对签名的校验
app.get('/', function (req, res, next) {
  var token = 'chenchao'
  const { signature, nonce, timestamp, echostr } = req.query
  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)

  if (sha === signature) {
    res.send(echostr + '');
  } else {
    res.send(wong);
  }
})
// 生成签名用于wx.config
app.get('/wechat/config', (req, res) => {
  var noncestr = sha1(new Date() + '') //前端传过来的随机字符串

  var timestamp = parseInt(new Date().getTime() / 1000) + '' //获取当前时间戳, 单位秒

  var url = req.query.url //获取前端页面的url, 不包括#及之后的内容
  //按照微信的官方说法要将用于生成签名的noncestr timestamp url jsapi_ticket 按照ASCII码由小到大排序, 以键值对的形式
  //拼接成字符串, "jsapi_ticket".charCodeAt()可查询
  var str = `jsapi_ticket=${jsapiTicketResult.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`

  // 使用哈希加密成签名
  var signature = sha1(str) //npm install sha1

  // 返回给前端
  res.send({
    returncode: 0,
    message: '获取config信息成功',
    data: {
      appid: appid,
      signature: signature,
      timestamp: timestamp,
      jsapi_ticket22: jsapiTicketResult.ticket,
      noncestr: noncestr
    }
  })
})
// 获取appId和appsecret
app.get('/authorize/init', function (req, res) {
  var channel = req.query.channel
  res.send({
    returncode: 10010,
    data: {
      appid: 'wx7b042c0bd0b508d8',
      appsecret: 'b20415f9be9431ca16901f7eb4a9120f'
    }
  })
})
// 通过前端授权后的code获取open_id
app.get('/user/queryOpenId', async (req, res) => {
  var query = req.query
  try {
    const access_token_info = JSON.parse(await requestGet(prefix + '/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret + '&code=' + query.code + '&grant_type=authorization_code'));
    const {
      access_token,
      expires_in,
      refresh_token,
      openid,
      scope
    } = access_token_info

    console.log(Object.prototype.toString.call(access_token_info))
    console.log(access_token_info)

    const user_info = JSON.parse(await requestGet(`${prefix}/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`))

    console.log('user_info: ', user_info)
    const user = await User.findOne({openid: user_info.openid})
    console.log('user: ', user)
    if (!user) { // 当前用户不存在 创建
      Object.assign(user_info, {
        phone: '',
        contacts: {},
        orderHotel: [],
        orderShop: []
      })
      const newUser = await User.create(user_info)
      console.log('创建新用户 newUser: ', newUser)
    }

    res.send({
      code: 0,
      message: '成功',
      data: openid
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
// 通过openId获取用户信息
app.get('/user/queryUserInfo', async (req, res) => {
  try {
    const { openid } = req.query
    // 根据openId查找当前用户信息
    const user = await User.findOne({openid})
    console.log('user---: ', user)
    res.send({
      code: 0,
      message: '成功',
      data: Object.assign(user, {
        orderShop: [],
        orderHotel: []
      })
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: -1,
      message: '失败'
    })
  }
})

/**---------------------------实际业务相关的接口请求------------------- */
app.get('/hotel/info', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({})
    res.send({
      code: 0,
      message: '成功',
      data: hotel
    })
  } catch (error) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.get('/hotel/rooms/info', async (req, res) => {
  try {
    const roomsInfo = await RoomCategory.find({})

    res.send({
      code: 0,
      message: '成功',
      data: roomsInfo
    })
  } catch (error) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.get('/hotel/room/info', async (req, res) => {
  try {
    const { id } = req.query
    const roomInfo = await Room.findOne({id})
    res.send({
      code: 0,
      message: '成功',
      data: roomInfo
    })
  } catch (error) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.get('/hotel/foods/info', async (req, res) => {
  try {
    const foodInfo = await FoodCategory.find({})

    res.send({
      code: 0,
      message: '成功',
      data: foodInfo
    })
  } catch (error) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.post('/user/editContacts', async (req, res) => {
  try {
    const { openid } = req.query
    const { name, tel } = req.body
    console.log('openid: ', openid, name, tel)
    // 根据openId查找当前用户信息
    const user = await User.findOneAndUpdate({openid}, {$set: {contacts : { name, tel }}})
    console.log('user---结果: ', user)
    res.send({
      code: 0,
      message: '成功',
      data: user
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.post('/user/createUserOrder', async (req, res) => {
  try {
    const { openid } = req.query
    const { contacts, order } = req.body
    const user = await User.findOne({openid})
    Object.assign(order, {
      no: (new Date()).valueOf() + '' + user._id, // 订单编号
      createTime: new Date(), // 创建时间
      status: 1 // 1 未支付完成
    })
    // 根据openId查找当前用户信息
    const newUser = await User.findOneAndUpdate({openid}, {$set: {contacts}, $push: {orderHotel: order}})
    console.log('newUser---结果: ', newUser)
    res.send({
      code: 0,
      message: '成功',
      data: newUser
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: -1,
      message: '失败'
    })
  }
})
app.get('/user/queryUserOrder', async (req, res) => {
  try {
    const { openid } = req.query
    const { orderHotel, orderShop } = await User.findOne({openid})
    res.send({
      code: 0,
      message: '成功',
      data: {
        orderHotel,
        orderShop
      }
    })
  } catch (error) {
    console.log(error)
    res.send({
      code: -1,
      message: '失败'
    })
  }
})

app.listen(9999, function () {
  console.log('listen 80 success');
});