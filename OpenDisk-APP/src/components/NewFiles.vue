<template>
  <v-dialog v-model="showPopup" max-width="500px" style="z-index:999999999999">
    <v-card>
      <v-card-title class="headline">Choississez votre fichier</v-card-title>
      <v-card-text>
         <v-alert v-if="info" :text="info" :type="sucess"></v-alert>

           <v-file-input  accept="image/*" label="Importer votre fichier" v-model="selectedFile"></v-file-input>

      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
        <v-btn color="primary" @click="importer">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

  import UserUtils from '@/utils/UserFunc.js'
export default {

  data() {
    return {
      showPopup: false,
      loading: false,
      info: '',
      sucess: '',
      selectedFile: '',
      notBlank: [
        value => {
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
    },async importer(){
      console.log(this.selectedFile[0])
      let result = await UserUtils.UploadFiles(this.$route.params.id, this.selectedFile[0])
      if(result){
        this.$emit('reload-parent');
        this.info = "Votre fichier a bien été importé !"
        this.sucess = "success"
        this.$router.go()
      }else{
        this.info = "Une erreur est survenue"
        this.sucess = "error"
      }
    }
  },
};
</script>
