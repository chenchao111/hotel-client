const { myReadFile } = require('../utils')
const { getModel } = require('./db')
const { prefix } = require('./prefix')

const hotel = getModel('hotel')

const createHotel = async () => {
  try {
    const hotelInfo = await myReadFile('../json/hotel.json')

    hotelInfo.cover = `${prefix}${hotelInfo.cover}`
    hotelInfo.images = hotelInfo.images.map(image => `${prefix}${image}`)
    console.log('hotel: ', hotel)
    const res = await hotel.create(hotelInfo)
    console.log('res: ', res)
  } catch (error) {
    console.error(error)
  }
}
createHotel()