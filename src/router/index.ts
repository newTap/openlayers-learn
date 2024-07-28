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
      name: 'DrawFeature',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/DrawFeatures.vue')
    },
    {
      path: '/vector-context-animation',
      name: 'Animation',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/VectorContextAnimation.vue')
    },
    {
      path: '/heat-map',
      name: 'HeatMap',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/HeatMap.vue')
    },
    {
      path: '/measure',
      name: 'measure',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/Measure.vue')
    },
    {
      path: '/cluster',
      name: 'cluster',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited
      component: () => import('../views/Cluster.vue')
    }
  ]
})

export default router
