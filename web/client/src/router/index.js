import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/routes/Welcome'
import Dashboard from '@/routes/Dashboard'
import Events from '@/routes/Events'
import store from '@/store'

Vue.use(Router)

const loaded = []

function loadBefore(...actions) {
  return function beforeEnter(to, from, next) {
    Promise.all(
      actions
        .filter(action => !loaded.includes(action))
        .map(action => loaded.push(action) && store.dispatch(action))
    ).then(() => next())
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome Page',
      component: Welcome
    }, {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: loadBefore('getAccount')
      // children: []
    }, {
      path: '/logout',
      beforeEnter (to, from, next) {
        if(store.state.logged)
          store.dispatch('logout').then(() => {
            next("/")
          })
        else next("/")
      }
    }, {
      path: '/login',
      beforeEnter (to, from, next) {
        if(!store.state.logged)
          store.dispatch('checkLogin').then(() => {
            next('/dashboard')
          })
        else next("/dashboard")
      }
    }, {
      path: '/events',
      component: Events
    }
  ]
})
