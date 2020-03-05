const { myReadFile } = require('../utils')
const { getModel } = require('./db')
const { prefix } = require('./prefix')

const food = getModel('food')
const foodCategory = getModel('foodCategory')

// const createFood = async () => {
//   try {
//     const foodInfo = await myReadFile('../json/food.json')

//     foodInfo.map(food => food.image = `${prefix}${food.image}`)
//     console.log('foodInfo: ', foodInfo)
//     const res = await food.create(foodInfo)
//     console.log('res: ', res)
//   } catch (error) {
//     console.error(error)
//   }
// }
const createFoods = async () => {
  const foodsInfo = await myReadFile('../json/foods.json')
  foodsInfo.forEach((foo) => foo.img = `${prefix}${foo.img}`)
  const foos = await food.find({})
  console.log('foos: ', foos)
  foodsInfo.forEach(({type, list}) => foos.forEach((foo) => type == foo.type && (list.push(foo))))
  console.log('foodsInfo: ', foodsInfo)
  const res = await foodCategory.create(foodsInfo)
}
// createFood()
createFoods()