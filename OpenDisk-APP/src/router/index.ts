// Composables
import UserUtils from '@/utils/UserFunc';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/myFiles/:id?',
    name: 'MyFiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyFiles.vue')
  },
  {
    path: '/activate/:activationcode',
    name: 'ActivateAccount',
    component: () => import(/* webpackChunkName: "about" */ '../views/ActivateAccount.vue')
  },
  {
    path: '/recovery/:recoverycode',
    name: 'RecoverAccount',
    component: () => import(/* webpackChunkName: "about" */ '../views/RecoverAccount.vue')
  },



]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
