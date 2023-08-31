<template>
  <NavBar style='z-index:20001' />
  <NewsComponents/>
  <HelloPage />
</template>

<script lang="ts" setup>
  import NewsComponents from '@/components/DisplayComponents/NewsComponents.vue';
  import NavBar from '@/components/NavigationComponents/NavigationBar.vue'
  import HelloPage from '@/components/DisplayComponents/HelloPage.vue'
</script>
