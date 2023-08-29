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

<script lang="ts">

  import UserUtils from '@/utils/UserFunc'
export default {

  data() {
    return {
      showPopup: false,
      loading: false,
      info: '',
      sucess:  'success' as 'success' | 'error',
      selectedFile: undefined,
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
    },async importer(){
      if(this.selectedFile){
        let result = await UserUtils.UploadFiles(parseInt(this.$route.params.id as string), this.selectedFile[0])
        if(result){
          this.$emit('reload-parent');
          this.info = "Votre fichier a bien été importé !"
          this.sucess = "success"
          this.$emit('reload')
        }else{
          this.info = "Une erreur est survenue"
          this.sucess = "error"
        }
      }
  }
  },
  watch: {
    'info'(newValue){
      setTimeout(()=>{
        this.error = ''
        this.showPopup = false;
      },3000)
    }
  }
};
</script>
