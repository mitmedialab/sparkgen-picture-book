/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from './components/Home/HomePage.vue'
import LoginPage from './components/Login/LoginPage.vue'
import VueCryptojs from 'vue-cryptojs'

Vue.use(VueRouter)
Vue.use(VueCryptojs)

const routes = [
    {path: '/', name: 'Login', component: LoginPage},
    {path: '/home', name: 'Home', component: HomePage}
]

const router = new VueRouter({routes})

router.beforeEach((to, from, next) => {
    if (router.app.$store) {
      if (to.name === 'Login') {
        next({name: 'Home'}) // Go to Login page if user navigates to Login and is signed in
        return
      }
}
  
    next()
  })

export default router
