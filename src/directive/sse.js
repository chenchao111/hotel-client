const config = {
  upColor: '#F54949',
  downColor: '#00B267',
  flatColor: '#666'
}
import { mul, significantFigure } from '@/utils/misc'

export default {
  install(Vue, options) {
    Vue.directive('updowncolor', (el, binding, vnode, oldVnode) => {
      var flag = Number(binding.value)
      if (flag > 0) {
        el.style.color = config.upColor
      } else if (flag < 0) {
        el.style.color = config.downColor
      } else {
        el.style.color = config.flatColor
      }
    })

    Vue.directive('updowncolor-bg', (el, binding, vnode, oldVnode) => {
      var flag = Number(binding.value)
      if (flag > 0) {
        el.style.backgroundColor = config.upColor
      } else if (flag < 0) {
        el.style.backgroundColor = config.downColor
      } else {
        el.style.backgroundColor = config.flatColor
      }
    })
    // 注册一个全局自定义指令 `v-focus`
    Vue.directive('focus', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: function (el) {
        // 聚焦元素
        el.focus()
      }
    })
    Vue.filter('money', function (value) {
      let val = Number(value)
      if (isNaN(val) || value === null || value === '') {
        return 0.00
      } else {
        return val.toFixed(2)
      }
    })

    Vue.filter('isNull', function (value) {
      if (value === null || value === '') {
        return '--'
      } else {
        return value
      }
    })
    Vue.filter('chngPct', function (value, multiple, isRound=false) {
      multiple && (value = mul(value, multiple))
      console.log('isRound: ', isRound)
      value = Number(significantFigure(Number(value), 2, isRound))
      if (value !== undefined) {
        if (value === null || value === '') {
          return '--'
        } else {
          if (value > 0) {
            return '+' + value + '%'
          } else if (value < 0) {
            return value + '%'
          } else {
            return '0.00%'
          }
        }
      }
    })
    Vue.filter('formatVolume', function (value) {
      if (value >= 100000000 || value <= -10000000) {
        value = (value / 100000000).toFixed(8)
        value = value.substring(0, value.lastIndexOf('.') + 3) + '亿'
      } else if (value >= 10000 && value < 100000000) {
        value = (value / 10000).toFixed(5)
        value = value.substring(0, value.lastIndexOf('.') + 3) + '万'
      } else {
        value = value.toFixed(2)
      }
      return value
    })

    Vue.filter('timestamp', function (value) {
      var date = new Date(value) // 获取一个时间对象
      date.getFullYear() // 获取完整的年份(4位,1970)
      // var mon = String(date.getMonth()).length === 1 ? '0' + date.getMonth() : date.getMonth() // 获取月份(0-11,0代表1月,用的时候记得加上1)
      // var day = String(date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate() // 获取日(1-31)
      var hour = String(date.getHours()).length === 1 ? '0' + date.getHours() : date.getHours() // 获取小时数(0-23)
      var min = String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes() // 获取分钟数(0-59)
      var second = String(date.getSeconds()).length === 1 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒数(0-59)

      return hour + ':' + min + ':' + second
    })

    Vue.filter('dayTime', function (value) {
      // typeof value === 'string' && (value = parseInt(value))
      var date = new Date(value) // 获取一个时间对象
      var year = date.getFullYear() // 获取完整的年份(4位,1970)
      var mon = Number(date.getMonth()) < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取月份(0-11,0代表1月,用的时候记得加上1)
      var day = String(date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate() // 获取日(1-31)
      var hour = String(date.getHours()).length === 1 ? '0' + date.getHours() : date.getHours() // 获取小时数(0-23)
      var min = String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes() // 获取分钟数(0-59)
      var second = String(date.getSeconds()).length === 1 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒数(0-59)

      return year + '.' + mon + '.' + day + ' ' + hour + ':' + min + ':' + second
    })
    Vue.filter('popularizeTime', function (value) {
      typeof value === 'string' && (value = parseInt(value))
      var date = new Date(value) // 获取一个时间对象
      var year = date.getFullYear() // 获取完整的年份(4位,1970)
      var mon = String(date.getMonth()).length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取月份(0-11,0代表1月,用的时候记得加上1)
      var day = String(date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate() // 获取日(1-31)
      var hour = String(date.getHours()).length === 1 ? '0' + date.getHours() : date.getHours() // 获取小时数(0-23)
      var min = String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes() // 获取分钟数(0-59)
      var second = String(date.getSeconds()).length === 1 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒数(0-59)

      return mon + '-' + day + ' ' + hour + ':' + min
    })
    Vue.filter('week', function (value) {
      value = value.replace(/-/g, '/')
      // 定义一个日期对象;
      var dateTime = new Date(value)
      // 获得系统年份;
      var year = dateTime.getFullYear()
      // 获得系统月份;
      var month = dateTime.getMonth() + 1
      // 获得系统当月分天数;
      var day = dateTime.getDate()
      // 获得系统小时;
      var hours = dateTime.getHours()
      // 获得系统分钟;
      var minutes = dateTime.getMinutes()
      // 获得系统秒数;
      var second = dateTime.getSeconds()
      // 获得系统星期几;
      var dayCycle = dateTime.getDay()
      // 使用数组更改日期样式;
      var dayCycleArray = ['日', '一', '二', '三', '四', '五', '六']
      for (var i = 0; i < 7; i++) {
        if (dayCycle === i) {
          // 将dayCycleArray的数赋值到系统星期几里面中去;
          dayCycle = dayCycleArray[i]
        }
      }
      month = month < 10 ? '0' + month : month
      // hours = hours < 10 ? '0' + hours : hours
      // minutes = minutes < 10 ? '0' + minutes : minutes
      // second = second < 10 ? '0' + second : second
      // 打印完整的系统日期;
      let dateStr = year + '-' + month + '-' + day + ' ' + '星期' + dayCycle + ' ' + hours + ':' + minutes + ':' + second
      dateStr = month + '月' + day + '日' + '  ' + '星期' + dayCycle
      return dateStr
    })

    /**
     * 使用方式:1、时间戳毫秒级 <div  v-z3-time="{ time: '1521279696000', type: '1' }"></div>
     2、日期格式<div  v-z3-time="{ time: '2018-03-22 10:21:12', type: '2' }"></div>
     3、type=1 & type=2
     （1）新闻的资讯按照时间1小时以内的是“多少分钟前”，1分钟内的资讯显示“刚刚”表示
     （2）当天内显示“小时:分钟”， 如“1:00”
     */
    Vue.directive('z3-time', (el, binding, vnode, oldVnode) => {
      var dateTimeStamp = binding.value.time // 传入时间戳
      var dateType = parseInt(binding.value.type)
      if (dateTimeStamp.indexOf('-') === -1) {
        dateTimeStamp = parseInt(binding.value.time)
      } else {
        dateTimeStamp = dateTimeStamp.replace(/-/g, '/')
      }

      if (dateTimeStamp !== undefined && dateTimeStamp != null && dateTimeStamp !== '') {
        if (dateTimeStamp.length === 13) {
          dateTimeStamp = parseInt(binding.value)
        } else {
          var timestamp = Date.parse(new Date(dateTimeStamp))
          dateTimeStamp = timestamp
        }
        var now = new Date().getTime()
        var dayConver = 1000 * 60 * 60 * 24
        var hourConver = 1000 * 60 * 60
        var minConver = 1000 * 60
        var timeConver = now - dateTimeStamp
        var tempConver
        var date = new Date(dateTimeStamp)
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
        if ((timeConver / dayConver) < 1) {
          if (dateType === 1) {
            tempConver = (timeConver / hourConver)
            if (tempConver >= 1) {
              el.innerHTML = parseInt(tempConver) + '小时前'
            } else {
              tempConver = (timeConver / minConver)
              if (tempConver >= 1) {
                el.innerHTML = parseInt(tempConver) + '分钟前'
              } else {
                el.innerHTML = '刚刚'
              }
            }
          } else {
            el.innerHTML = h + m
          }
        } else {
          var curTimeMillis = new Date().getTime() // 系统当前时间戳
          var curDate = new Date(curTimeMillis)
          var todayHoursSeconds = curDate.getHours() * 60 * 60
          var todayMinutesSeconds = curDate.getMinutes() * 60
          var todaySeconds = curDate.getSeconds()
          var todayMillis = (todayHoursSeconds + todayMinutesSeconds + todaySeconds) * 1000
          var todayStartMillis = curTimeMillis - todayMillis
          var oneDayMillis = 24 * 60 * 60 * 1000
          var yesterdayStartMilis = todayStartMillis - oneDayMillis
          if (dateTimeStamp >= yesterdayStartMilis) {
            el.innerHTML = '昨天 ' + h + m
          } else {
            el.innerHTML = M + D + h + m
          }
        }
      } else {
        el.innerHTML = '--'
      }
    })
  }
}