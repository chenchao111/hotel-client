const SET_USER_INFO = 'set_user_info'
const SET_USER_ORDERS = 'set_user_orders'

import Storage from '@/utils/storage'
const lStorage = new Storage('localStorage')

import { loginApi } from '@/api'

const state = {
  openid: lStorage.getItem('openid'),
  user: {},
  orderHotel: [],
  orderShop: []
}

const mutations = {
  [SET_USER_INFO](state, {user}) {
    state.user = user
  },
  [SET_USER_ORDERS](state, {orderHotel, orderShop}) {
    state.orderHotel = orderHotel
    state.orderShop = orderShop
  }
}

const actions = {
  async queryUserInfo ({ commit, state }, {appid}) {
    try {
      const { openid } = state
      const user = await loginApi.queryUserInfo({appid, openid})
      console.log('user: ', user)
      commit(SET_USER_INFO, {user})
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async editUserContact ({ commit, state }, {name, tel}) {
    try {
      const { openid } = state
      const user = await loginApi.editUserContact({openid, name, tel})
      console.log('user----edit: ', user)
      commit(SET_USER_INFO, {user})
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async createUserOrder ({ commit, state }, {contacts, order}) {
    try {
      const { openid } = state
      const user = await loginApi.createUserOrder({contacts, order, openid})
      console.log('user----edit: ', user)
      commit(SET_USER_INFO, {user})
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async queryUserOrder ({ commit, state }, {} = {}) {
    try {
      const { openid } = state
      const {orderHotel, orderShop} = await loginApi.queryUserOrder({openid})
      commit(SET_USER_ORDERS, {orderHotel, orderShop})
      return Promise.resolve({orderHotel, orderShop})
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
