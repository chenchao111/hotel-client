/* eslint-disable */

/**
 * 生产环境地址
 */
const productUrl = function () {
  const protocol = 'https'
  const url = 'open.aibaoxian.com/czh'
  const port = '8920'
  let address = protocol + '://' + url
  return address
}

/**
 * 开发环境地址
 */

const devUrl = function () {
  const protocol = 'http'
  const url = 'dev.open.aibaoxian.com/czh'
  // const url = '192.168.100.45:8188/czh'
  const port = '8188/czh'
  let address = protocol + '://' + url
  return address
}

/**
 * 本地开发环境地址
 */
const debugUrl = function () {
  const protocol = 'http'
  const url = '139.224.145.118'
  const port = '8180'
  let address = protocol + '://' + url + ':' + port
  return address
}

export function CommonUrl () {
  // return devUrl()
  return productUrl()
}

export function CommonUrlTransfer () {
  return 'http://czh.aibaoxian.com'
  // return 'http://dev.czh.aibaoxian.com'
}

