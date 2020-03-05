const getters = {
  name: state => state.hotel.name,
  images: state => state.hotel.images,
  location: state => state.hotel.location,
  phone: state => state.hotel.phone,
  cover: state => state.hotel.cover,
  rooms: state => state.hotel.rooms,
  room: state => state.hotel.room,
  date: state => state.hotel.date,
  foods: state => state.food.foods,
  cars: state => state.food.cars,
  user: state => state.user.user,
  orderHotel: state => state.user.orderHotel,
  orderShop: state => state.user.orderShop
}
export default getters