const SET_FOODS = 'set_foods'
const SET_EDIT_CARS = 'set_edit_cars'
const SET_REMOVE_CARS = 'set_remove_cars'
const SET_CAR_EDIT_CARS = 'set_car_edit_cars'

import Storage from '@/utils/storage'
const lStorage = new Storage('localStorage')

import { foodApi } from '@/api'

const state = {
  foods: [],
  cars: lStorage.getItem('cars') ? lStorage.getItem('cars') : []
}

const mutations = {
  [SET_FOODS](state, {foods}) {
    state.foods = foods
  },
  [SET_EDIT_CARS](state, {food}) {
    const { cars } = state
    const { value, id } = food
    const foo = cars.find(foodInfo => foodInfo.id === food.id)
    if (foo) {
      if (value) {
        foo.value = food.value
      } else {
        const index = cars.indexOf(foo)
        index >= 0 && cars.splice(index, 1)
      }
    } else {
      if (value) {
        cars.push(Object.assign({}, {...food}))
      }
    }
    lStorage.setItem('cars', cars)
  },
  [SET_CAR_EDIT_CARS](state, {food}) {
    const { cars, foods } = state
    const { value, id } = food
    console.log('value: ', value)
    foods.forEach(({list}) => list.forEach(foo => foo.id === id && (foo.value = value)))
    if (!value) {
      const index = cars.indexOf(food)
      console.log('index: ', index)
      index >= 0 && cars.splice(index, 1)
    }
    lStorage.setItem('cars', cars)
  },
  [SET_REMOVE_CARS](state, {food}) {
    const { cars } = state
    const index = cars.indexOf(food)
    console.log('index: ', index)
    index >= 0 && cars.splice(index, 1)
    lStorage.setItem('cars', cars)
  }
}

const actions = {
  async queryFoodsInfo ({ commit, state }, data) {
    try {
      const { cars } = state
      const foods = await foodApi.queryFoodsInfo()
      foods.forEach(food => food.list.map(foo => foo.value = 0))
      console.log('cars: ', cars)
      cars.forEach(foodInfo => foods.forEach((food) => food.list.forEach((foo) => foo.id === foodInfo.id && (foo.value = foodInfo.value))))
      console.log('foods---: ', foods)
      commit(SET_FOODS, {foods})
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
