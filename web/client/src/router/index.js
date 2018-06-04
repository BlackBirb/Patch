import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/routes/Welcome'
import Dashboard from '@/routes/Dashboard'
import store from '@/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome Page',
      component: Welcome
    }, {
      path: '/dashboard/:id?',
      name: 'Dashboard',
      component: Dashboard
    }, {
      path: '/logout',
      beforeEnter (to, from, next) {
        if(store.state.logged)
          store.dispatch('logout').then(r => {
            next("/")
          })
        else next("/")
      }
    }, {
      path: '/login',
      beforeEnter (to, from, next) {
        if(!store.state.logged)
          store.dispatch('checkLogin').then(r => {
            next('/dashboard')
          })
        else next("/dashboard")
      }
    }, {
      path: '/api/login',
      redirect: '/login'
    }, {
      path: '/api/logout',
      redirect: '/logout'
    }
  ]
})
