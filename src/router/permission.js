import router from './index'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { addRouter } from '@/router'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        const info = store.getters.info
        if (info.roles && info.roles.length > 0) {
          next()
        } else {
          await store.dispatch('user/getInfo')
          // 根据获取的roles过滤出异步路由，通过addRouter添加到当前router里面
          addRouter(store.getters.routeList.accessedAsyncRoutes)
          next({ ...to, replace: true })
        }
      } catch (error) {
        await store.dispatch('user/resetToken')
        Message.error(error || '错误')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
