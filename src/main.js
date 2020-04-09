import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局样式
import 'normalize.css/normalize.css'
import '@/styles/index.scss'

// svg图标
import '@/icons'
// router路由守卫
import '@/router/permission'
// 插件
import '@/plugins/element-ui'

Vue.config.productionTip = false

console.log(store)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
