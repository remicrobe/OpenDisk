<template>
  <OptionsBar @reload="sendReloadToChild()" @search="search"/>
  <DisplayFilesFolders @reload="this.$refs.navbar.reload()" ref="displayfiles" :datatosearch="toSearch" />
  <NavBar ref="navbar" style='z-index:20001;'/>
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
  components:{
    NavBar,
    OptionsBar,
    HelloPage,
    DisplayFilesFolders
  },
    data(){
      return{
        toSearch: '',
      };
    },
    methods:{
      search(value:string){
        console.log(value)
        this.toSearch = value
      },
      sendReloadToChild(){
        this.$refs.displayfiles.getContents()
        this.$refs.navbar.reload()
      }
    },

  };
</script>



<style>
  .v-application__wrap {
    min-height: 0vh !important;
  }


</style>
