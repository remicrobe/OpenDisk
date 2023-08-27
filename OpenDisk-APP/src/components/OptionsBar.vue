<template>
  <div>
    <v-toolbar
      dark
      color="white"
      elevation="1"
    >
      <v-app-bar-nav-icon ></v-app-bar-nav-icon>

        <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>


<v-spacer></v-spacer>
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        v-model="searchzone"
      ></v-text-field>
      <v-spacer></v-spacer>




      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
        <v-menu activator="parent" location="start">
        <v-list>
          <v-list-item
          >
            <v-list-item-title @click="this.$refs.filespopup.openPopup()" v-if="$route.params.id">Importer un fichier</v-list-item-title>
            <v-list-item-title @click="this.$refs.folderpopup.openPopup()" >Nouveau dossier</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </v-btn>
    </v-toolbar>
    <NewFolderPopUp ref="folderpopup"></NewFolderPopUp>
    <NewFiles ref="filespopup"></NewFiles>

  </div>

</template>

<script lang="ts">
import NewFiles from '@/components/NewFiles.vue'
import NewFolderPopUp from '@/components/NewFolderPopUp.vue'
export default {


  components:{
    NewFolderPopUp,
    NewFiles
  },
  data() {
    return {
      drawer: false,
      searchzone: ""
    };
  },
  watch:{
    'searchzone'(oldValue,newValue){
      this.$emit('search', this.searchzone)
    }
  }
};
</script>
