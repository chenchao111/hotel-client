const routers = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   redirect: '/loginTrans'
  // },
  { // 酒店预订权限验证中转页
    path: '/auth',
    name: 'auth-trans',
    meta: {
      title: '微信授权'
    },
    component: () => import('@/views/login/trans/auth/index')
  },
  { // 微信中转页
    path: '/login',
    name: 'login-trans',
    meta: {
      title: '微信授权'
    },
    component: () => import('@/views/login/trans/index')
  },
  { // 手机号登录页
    path: '/loginPhone',
    name: 'login-phone',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/login/loginPhone/index')
  },
  { // 实名认证
    path: '/authName',
    name: 'auth-name',
    meta: {
      title: '实名认证'
    },
    component: () => import('@/views/login/auth/name/index')
  },
  { // 资质认证
    path: '/authAptitudes',
    name: 'auth-aptitudes',
    meta: {
      title: '资质认证'
    },
    component: () => import('@/views/login/auth/aptitudes/index')
  },
  { // cfa认证
    path: '/authCfa',
    name: 'auth-cfa',
    meta: {
      title: '资质认证'
    },
    component: () => import('@/views/login/auth/cfa/index')
  },
  { // 审核
    path: '/authExam',
    name: 'auth-exam',
    meta: {
      title: '审核中'
    },
    component: () => import('@/views/login/auth/exam/index')
  }
]

export default routers
