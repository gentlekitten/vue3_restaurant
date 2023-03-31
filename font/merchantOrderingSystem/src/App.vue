<template>
  <router-view v-slot="{ Component }">
    <keep-alive v-if="$route.meta && $route.meta.keepAlive">
      <component :is="Component" />
    </keep-alive>
    <component :is="Component" v-if="$route.meta && !$route.meta.keepAlive" />
  </router-view>
</template>
<script setup lang="ts">
const include = ['GoodsList']
</script>
<style>
</style>
