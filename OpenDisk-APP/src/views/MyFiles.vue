<template>
  <OptionsBar @search="search"/>
  <DisplayFilesFolders :datatosearch="toSearch" />
  <NavBar   style='z-index:20001;'/>
  <HelloPage />




</template>

<script setup>
  import UserUtils from '@/utils/UserFunc.js'
  import NavBar from '@/components/NavigationBar.vue'
  import OptionsBar from '@/components/OptionsBar.vue'
  import HelloPage from '@/components/HelloPage.vue'
  import DisplayFilesFolders from "@/components/DisplayFilesFolders.vue"


</script>

<script>
 export default {
    data(){
      return{
        toSearch: '',
      };
    },
    methods:{
      search(value){
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
