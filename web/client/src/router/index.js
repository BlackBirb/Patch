import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/routes/Welcome'
import Dashboard from '@/routes/Dashboard'

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
    }
  ]
})
