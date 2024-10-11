<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="w-full">
    <Navbar />
    <RouterView />
  </div>
  
</template>

<style scoped>
</style>
