const { myReadFile } = require('../utils')
const { getModel } = require('./db')
const { prefix } = require('./prefix')

const room = getModel('room')
const roomCategory = getModel('roomCategory')

const createRoom = async () => {
  try {
    const roomInfo = await myReadFile('../json/room.json')
    roomInfo.forEach(room => {
      const { cover, images, traits } = room
      room.cover = `${prefix}${cover}`
      room.images = images.map(image => `${prefix}${image}`)
      room.traits = traits.map(trait => ({
        ...trait,
        "img": `${prefix}${trait.img}`
      }))
    })
    console.log('roomInfo: ', roomInfo)
    const res = await room.create(roomInfo)
    console.log('res: ', res)
  } catch (error) {
    console.error(error)
  }
}
const createRooms = async () => {
  try {
    const roomsInfo = await myReadFile('../json/rooms.json')
    const rooms = await room.find({})
    console.log('roomsInfo: ', roomsInfo)
    roomsInfo.forEach(({type, list}) => rooms.forEach((roo) => type === roo.type && list.push(roo)))
    const res = await roomCategory.create(roomsInfo)
    console.log('res: ', res)
  } catch (error) {
    console.error(error)
  }
}
createRooms()