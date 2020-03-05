<template>
  <!-- <transition :name="transitionName" type="transition" mode="out-in"> -->
    <navigation>
      <router-view v-wechat-title="$route.meta.title" class="Router" v-if="isRouterAlive"></router-view>
      <!-- <router-view class="Router" v-if="isRouterAlive"></router-view> -->
    </navigation>
  <!-- </transition> -->
</template>

<script>

export default {
  name: 'App',
  created: function () {
    this.$navigation.on('forward', (to, from) => {
      console.log('前进')
      this.transitionName = 'slide-left'
    })
    this.$navigation.on('back', (to, from) => {
      console.log('后退')
      this.transitionName = 'slide-right'
    })
    this.$navigation.on('replace', (to, from) => {
      console.log('替换')
    })
    this.$navigation.off('refresh', (to, from) => {
      console.log('刷新')
    })
    this.$navigation.on('reset', () => {
      console.log('重置')
    })
  },
  provide() {
    return {
      reload: this.relaod
    }
  },
  data () {
    return {
      transitionName: '',
      isRouterAlive: true
    }
  },
  methods: {
    relaod() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        console.log('刷新页面')
        this.isRouterAlive = true
      })
    }
  },
  watch: {
    $route(to, from) {
    }
  }
}
</script>

<style>
@import '/common/css/reset.css';
@import '/common/css/common.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  font-size: .32rem;
}
.Router {
  /* position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0; */
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  /* will-change: transform; */
  transition: transform .3s;
  /* position: absolute; */
  /* width:100%; */
  /* left:0; */
  /* top: 0; */
}
.slide-right-enter {
  transform: translate(-100%, 0);
}
.slide-right-leave-active {
  /* transform: translateX(100%); */
}
.slide-right-leave-to {
  transform: translate(100%, 0);
}
.slide-left-enter {
  transform: translate(100%, 0);
}
.slide-left-leave-active {
  /* transform: translateX(-100%); */
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.fade-enter-active, .fade-leave-active {
  /* transition: opacity .5s */
}
.fade-enter, .fade-leave-active {
  /* opacity: 0 */
}
</style>
