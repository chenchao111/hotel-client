import request from '@/http/request'
import { prefix } from '../prefix'

export const queryHotelInfo = () => {
  return request({
    url: `${prefix}/hotel/info`,
    method: 'get'
  })
}

export const queryRoomsInfo = () => {
  return request({
    url: `${prefix}/hotel/rooms/info`,
    method: 'get'
  })
}

export const queryRoomInfo = (id = 1) => {
  return request({
    url: `${prefix}/hotel/room/info`,
    method: 'get',
    params: {
      id
    }
  })
}
