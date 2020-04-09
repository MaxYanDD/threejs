import Vue from 'vue'
import VueRouter from 'vue-router'
import constantRoutes from '@/router/constantRoutes'

Vue.use(VueRouter)

const createRouter = () => {
  return new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
}

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export function addRouter(routes) {
  router.addRoutes(routes)
}

export default router
