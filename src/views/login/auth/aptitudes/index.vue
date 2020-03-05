<template>
  <div class="auth-aptitudes-page">
    <ul class="auth-list">
      <li @click="authClick(item)" v-for="(item, index) in list" :key="index" :class="{normal: true, auth: parseInt(item.verifyType) === 1, review: parseInt(item.verifyType) === 0}">
        {{item.name}}
        <span class="tip">{{parseInt(item.verifyType) === 0 ? '审核中' : ''}}{{parseInt(item.verifyType) === 1 ? '已认证' : ''}}</span>
      </li>
    </ul>
    <div class="btn-list flex-p">
      <!-- <span @click="backClick" class="flex-c-0">上一步</span> -->
      <!-- <span @click="nextClick" class="flex-c-0 ml-15">下一步</span> -->
      <span @click="nextClick" class="flex-c-1">提交审核</span>
    </div>
  </div>
</template>

<script>
import { queryCommitIntelligenceInfo, commitIntelligence } from '@/api/login'
export default {
  name: 'auth-aptitudes-page',
  created() {
    // 设置title
    // this.setTitle('资质认证')
    this.init()
  },
  data () {
    return {
      // 1 投资顾问 2 证券从业资格 3 银行从业资格 4基金销售资格 5保险销售资格 6期货从业资格 7会计从业资格 8法律职业资格证 9 经济师资格 10 CFA证书 11 CFP证书 12 FRM证书 13CIIA证书 14CPA证书 15 AFP证书 16 其他
      // {
      //   type: 1,
      //   name: '投顾认证',
      //   verifyType: 2
      // },
      list: [{
        type: 2,
        name: '证券从业资格',
        verifyType: 2
      },
      {
        type: 3,
        name: '银行从业资格',
        verifyType: 2
      },
      {
        type: 4,
        name: '基金销售资格',
        verifyType: 2
      },
      {
        type: 5,
        name: '保险销售资格',
        verifyType: 2
      },
      {
        type: 6,
        name: '期货从业资格',
        verifyType: 2
      },
      {
        type: 7,
        name: '会计从业资格',
        verifyType: 2
      },
      {
        type: 8,
        name: '法律职业资格证',
        verifyType: 2
      },
      {
        type: 9,
        name: '经济师资格',
        verifyType: 2
      },
      {
        type: 10,
        name: 'CFA证书',
        verifyType: 2
      },
      {
        type: 11,
        name: 'CFP证书',
        verifyType: 2
      },
      {
        type: 12,
        name: 'FRM证书',
        verifyType: 2
      },
      {
        type: 13,
        name: 'CIIA证书',
        verifyType: 2
      },
      {
        type: 14,
        name: 'CPA证书',
        verifyType: 2
      },
      {
        type: 15,
        name: 'AFP证书',
        verifyType: 2
      }]
      // {
      //   type: 16,
      //   name: '其他',
      //   verifyType: 2
      // }]
    }
  },
  methods: {
    // 上一步 跳转实名认证
    // backClick() {
    //   this.$router.push({
    //     name: 'auth-name'
    //   })
    // },
    // 下一步 跳转审核
    async nextClick() {
      try {
        if (this.items.length === 0) {
          this.$notify('请添加认证信息')
          return
        }
        const item = this.items.find(item => item.type === 1)
        var str = ''
        this.items.forEach(item => {
          str += `${item.type}|${parseInt(item.type) === 1 ? item.city : item.url}|${item.verifyType ? 'true' : 'false'},`
        })
        str = str.slice(0, str.length - 1)
        const obj = item || {
          certificationNum: '', // 整数编号
          city: '', // 城市 string
          company: '', // 公司名称
          experienceScope: 0, // 工作年限
          position: '', // 岗位
          province: '' // 省
        }
        console.log(obj)
        const res = await commitIntelligence({
          userId: this.tgid(),
          applyTypeInfo: str,
          ...obj
        })
        console.log(res)
        this.$router.push({
          name: 'auth-exam'
        })
      } catch (error) {
        console.warn(error)
      }
    },
    // 上传资质审核
    authClick(item) {
      if (parseInt(item.verifyType) !== 1) { // 未通过审核的都可以点击进行编辑页
        this.$router.push({
          name: 'auth-cfa',
          query: {
            type: item.type, // 类型
            name: item.name
          }
        })
      }
    },
    async init() {
      try {
        let res = await queryCommitIntelligenceInfo({
          userId: this.tgid()
        })
        res = (res || [])
        console.log(res)
        this.items = res
        for (let index = 0; index < res.length; index++) {
          const item = res[index]
          if (parseInt(item.type) !== 1) {
            const currentIndex = parseInt(item.type)
            this.list[currentIndex - 2].verifyType = item.verifyType
          }
        }
        console.log(this.list)
        // for (const val of res.values()) {
        //   const currentIndex = parseInt(val.type)
        //   this.list[currentIndex - 1].verifyType = val.verifyType
        // }
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth-aptitudes-page {
  width: 100%;
  padding: 20px 25px;
  box-sizing: border-box;
}
.auth-list {
  padding-bottom: 50px;
}
.auth-list li:nth-child(2n) {
  margin-right: 0;
}
.normal {
  position: relative;
  display: inline-block;
  width: 150px;
  height: 75px;
  line-height: 75px;
  text-align: center;
  margin: 0 25px 20px 0;
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color:rgba(255,250,237,1);
  background-image: linear-gradient(-10deg, #D8BC88 21%, #E3CF9B 93%);
  box-shadow: 0 3px 4px 0 rgba(168,150,98,0.37);
  border-radius: 4px;
}
.auth {
  background: url('//sl.jiangedev.com/static/auth.png') 0 0 no-repeat;
  background-size: 100% 100%;
}
.review {
  background: url('//sl.jiangedev.com/static/review.png') 0 0 no-repeat;
  background-size: 100% 100%;
}
.btn-list {
  margin-top: 25px;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
}
.btn-list span{
  display: inline-block;
  width: 160px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-image: linear-gradient(-131deg, #ECCC83 0%, #E3A851 80%);
  box-shadow: 0 3px 5px 0 rgba(195,162,72,0.37);
  /* border-radius: 22px; */
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0.28px;
}
.tip {
  position: absolute;
  display: block;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color:rgba(255,250,237,1);
  line-height: 17px;
  top: 2px;
  left: 7px;
}
</style>
