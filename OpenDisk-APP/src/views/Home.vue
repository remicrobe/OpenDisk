<template>
  <NavBar style='z-index:20001' />
  <NewsComponents/>
  <HelloPage />
</template>

<script lang="ts" setup>
  import NewsComponents from '@/components/NewsComponents.vue';
  import NavBar from '@/components/NavigationBar.vue'
  import HelloPage from '@/components/HelloPage.vue'
</script>
