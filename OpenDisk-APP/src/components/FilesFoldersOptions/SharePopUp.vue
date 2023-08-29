<template>
  <v-dialog v-model="showPopup" max-width="500px">
    <v-card>
      <v-card-title class="headline">Partager votre fichier</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
          <v-text-field autofocus ref="sharedLinkText" label="Votre lien : " :disabled=false :loading="loading" v-model="sharedlink" variant="outlined" required></v-text-field>
          <v-btn type="submit" :loading="loading" block class="mt-2" @click="copy">Copier</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">

  import UserUtils from '@/utils/UserFunc'
import { rename } from 'fs';
export default {

  data() {
    return {
      showPopup: false,
      loading: false,
      mail: '',
      error: '',
      type: '',
      idtoshare: 0,
      sharedlink: '404',
      popuptype:  'error' as 'success' | 'error',
    };
  },
  methods: {
    async openPopup(type:string, idfichier:number) {

      this.type = type
      this.idtoshare = idfichier
      this.showPopup = true;
      this.sharedlink = await this.getSharedLink()
    },
    closePopup() {
      this.showPopup = false;
    },
    async getSharedLink(){
      if(this.idtoshare){
        let result = await UserUtils.GetSharedLink(this.idtoshare)
        if(result){
          if(result.sucess.sucess){
            return result.sucess.sucess
          }else{
            return "Erreur"
          }
        }else{
          return "Erreur"
        }
      }
    },
    copy(){


        try {
            this.$refs.sharedLinkText.select()
            document.execCommand('copy');
            this.popuptype = "success"
            this.error = "Lien copié !"
        } catch (error) {
            console.error(error);
        }


    }
  },
  watch: {
    'error'(newValue){
      setTimeout(()=>{
        this.error = ''
      },3000)
    }
  }
};
</script>
