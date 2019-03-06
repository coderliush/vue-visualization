import Vue from 'vue'
import Router from 'vue-router'

const Login = (resolve) => {
  import('views/login/login').then((module) => {
    resolve(module)
  })
}

const Layout = (resolve) => {
  import('views/layout/layout').then((module) => {
    resolve(module)
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
