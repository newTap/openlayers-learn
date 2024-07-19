<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
const router = [
  {
    path: '/',
    label: 'Home'
  },
  {
    path: '/geo-json',
    label: 'GeoJson'
  },
  {
    path: '/draw-feature',
    label: 'drawFeature'
  },
  {
    path: '/vector-context-animation',
    label: 'vectorContextAnimation'
  },
  {
    path: '/about',
    label: 'About'
  }
]
</script>

<template>
  <header>
    <nav>
      <RouterLink
        v-for="item in router"
        :to="item.path"
        :key="item.label"
        style="margin-right: 20px"
        >{{ item.label }}</RouterLink
      >
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  padding: 20px 40px;
}
</style>
