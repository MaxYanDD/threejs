import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import constantRoutes from '@/router/constantRoutes'
import asyncRoutes from '@/router/asyncRoutes'
import { resetRouter } from '@/router'

// todo 把token放在cookie是否合适？
// 前端路由可以在前端先定义所有的，通过角色来定义获取路由权限
// 也可以后台返回路由，这里使用前端预先写好路由表，通过用户身份来获取路由信息

const state = {
  token: getToken(),
  info: {
    name: '',
    avatar: '',
    introduction: '',
    roles: []
  },
  routeList: {
    AllRoutes: [],
    accessedAsyncRoutes: []
  }
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROUTES: (state, routes) => {
    state.routeList.accessedAsyncRoutes = routes
    state.routeList.AllRoutes = constantRoutes.concat(routes)
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(({ data }) => {
        if (data) {
          commit('SET_INFO', data)
          if (data.roles && data.roles.length > 0) {
            dispatch('generateRoutes', data.roles)
            resolve(data)
          } else {
            reject()
          }
        } else {
          reject()
        }
      })
    })
  },
  async logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', {
            name: '',
            avatar: '',
            introduction: '',
            roles: []
          })
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_INFO', {
        name: '',
        avatar: '',
        introduction: '',
        roles: []
      })
      removeToken()
      resolve()
    })
  },
  // 生产异步路由配置
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedAsyncRoutes = []
      if (roles.includes('admin')) {
        accessedAsyncRoutes = asyncRoutes
      } else {
        accessedAsyncRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedAsyncRoutes)
      resolve(accessedAsyncRoutes)
    })
  }
  // 重置路由配置
}

/**
 * 判断当前角色是否有该route的权限
 * @param roles
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 过滤出有权限的所有异步路由
 * @param routes
 * @param roles
 * @returns {*}
 */
function filterAsyncRoutes(routes, roles) {
  return routes.reduce((res, route) => {
    if (hasPermission(roles, route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, roles)
      }
      return res.concat(route)
    } else {
      return res
    }
  }, [])
}
export default { namespaced: true, state, mutations, actions }
