import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './utils/filters'
import http from './services/http'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'styles/index.styl'

Vue.use(ElementUI)
Vue.use(http)
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
