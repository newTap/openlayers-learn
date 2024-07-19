import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

console.log('import.meta', import.meta)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/geo-json',
      name: 'geojson',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GeoJson.vue')
    },
    {
      path: '/draw-feature',
      name: 'geojson',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/DrawFeatures.vue')
    }
  ]
})

export default router
