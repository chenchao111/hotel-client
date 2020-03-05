import request from '@/http/request'
import { prefix } from '../prefix'

export const queryFoodsInfo = () => {
  return request({
    url: `${prefix}/hotel/foods/info`,
    method: 'get'
  })
}
