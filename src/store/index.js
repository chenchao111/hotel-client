import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import hotel from './hotel'
import food from './food'
import user from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    hotel,
    food,
    user
  },
  getters
})

export default store
