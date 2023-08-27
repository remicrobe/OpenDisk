<template>
  <OptionsBar @search="search"/>
  <DisplayFilesFolders :datatosearch="toSearch" />
  <NavBar   style='z-index:20001;'/>
  <HelloPage />




</template>

<script setup lang="ts">
  import NavBar from '@/components/NavigationBar.vue'
  import OptionsBar from '@/components/OptionsBar.vue'
  import HelloPage from '@/components/HelloPage.vue'
  import DisplayFilesFolders from "@/components/DisplayFilesFolders.vue"


</script>

<script lang="ts">
 export default {
    data(){
      return{
        toSearch: '',
      };
    },
    methods:{
      search(value:string){
        console.log(value)
        this.toSearch = value
      }
    }
  };
</script>



<style>
  .v-application__wrap {
    min-height: 0vh !important;
  }


</style>
