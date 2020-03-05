import request from '@/http/request'
import { prefix } from '@/api/prefix' 

// 获取用户openId
export const queryOpenId = ({appid, code}) => {
  return request({
    url: `${prefix}/user/queryOpenId`,
    method: 'get',
    params: {
      appid, code
    }
  })
}

export const queryUserInfo = ({appid, openid}) => {
  return request({
    url: `${prefix}/user/queryUserInfo`,
    method: 'get',
    params: {
      appid, openid
    }
  })
}

export const editUserContact = ({openid, name, tel}) => {
  return request({
    url: `${prefix}/user/editContacts`,
    method: 'post',
    params: {
      openid
    },
    data: {
      name, tel
    }
  })
}

export const createUserOrder = ({contacts, order, openid}) => {
  return request({
    url: `${prefix}/user/createUserOrder`,
    method: 'post',
    params: {
      openid
    },
    data: {
      contacts, order
    }
  })
}

export const queryUserOrder = ({openid}) => {
  return request({
    url: `${prefix}/user/queryUserOrder`,
    method: 'get',
    params: {
      openid
    }
  })
}