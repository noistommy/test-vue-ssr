<script setup>
import HomeView from './views/HomeView.vue'
import { useSSRContext } from 'vue'

import { ref, computed } from 'vue'

const baseStyle = computed(() => {
  return {
    color: 'rgba(255, 255, 255, 0.87)',
    backgroundColor: '#242424',
    padding: '30px'
  }
})

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <div :style="baseStyle">
    <router-link to="/">HOME</router-link> | 
    <router-link to="/test">TEST</router-link>
    <div class="router-view">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
