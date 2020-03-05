const routers = [
  { // 酒店确认订单页
    path: '/orderHotel',
    name: 'order-hotel',
    meta: {
      title: '确认订单'
    },
    component: () => import('@/views/order/hotel/index')
  },
  { // 商品确认订单页
    path: '/orderShop',
    name: 'order-shop',
    meta: {
      title: '确认订单'
    },
    component: () => import('@/views/order/shop/index')
  },
]

export default routers
