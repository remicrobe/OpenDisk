<template>
  <v-dialog v-model="showPopup" max-width="500px" style="z-index:999999999999">
    <v-card>
      <v-card-title class="headline">Choississez le nom du dossier</v-card-title>
      <v-card-text>
         <v-alert v-if="info" :text="info" :type="sucess"></v-alert>

           <v-text-field label="Nom dossier" :rules="notBlank" :loading="loading" v-model="folderName" variant="outlined" required></v-text-field>

      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
        <v-btn color="primary" @click="createFolder">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">


import FoldersFunc from '@/utils/FoldersFunc';
export default {

  data() {
    return {
      showPopup: false,
      loading: false,
      info: '',
      sucess:  'success' as 'success' | 'error',
      folderName: '',
      notBlank: [
      (value:string) => {
          if (value) return true

          return 'Ne peut être vide.'
        },
      ],
    };
  },
  methods: {
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    async createFolder(){
      let FolderCreated = await FoldersFunc.CreateFolder(parseInt(this.$route.params.id as string),this.folderName)
      if(FolderCreated){
        this.sucess = "success"
        this.info = "Votre dossier a bien été créé"
        this.$emit('reload')
      }
    }
  },
  watch: {
    'info'(newValue){
      this.folderName = ''
      setTimeout(()=>{
        this.info = ''

        this.showPopup = false;
      },3000)
    }
  }
};
</script>
