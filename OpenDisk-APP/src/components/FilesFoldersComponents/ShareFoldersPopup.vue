<template>
  <v-dialog v-model="showPopup" max-width="500px">
    <v-card>
      <v-card-title class="headline">Partager votre {{this.type}}</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
          <v-text-field autofocus ref="sharedLinkText" label="Mail de l'utilisateur : " :disabled=false :loading="loading" v-model="mail" variant="outlined" required></v-text-field>
          <v-btn type="submit" :loading="loading" block class="mt-2" @click="share">Partager</v-btn>
      </v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="shareduser in sharedusers"
          :key="shareduser.email"
          :title="shareduser.email"
          :prepend-avatar=shareduser.profilepic
        ><v-chip  style="float: right;" color="primary" append-icon="mdi-close" @click="remove(shareduser.email)" x-small>Partagé</v-chip></v-list-item>
      </v-list>


      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">

import FoldersFunc from '@/utils/FoldersFunc';
import { TypeUser } from '@/utils/UtilsFunc';
import UserFunc from '@/utils/UserFunc';

export default {

  data() {
    return {
      showPopup: false,
      loading: false,
      mail: '',
      error: '',
      type: '',
      idtoshare: 0,
      sharedusers: [] as TypeUser[],
      popuptype:  'error' as 'success' | 'error',
    };
  },
  methods: {
    async openPopup(type:string, idfichier:number) {

      this.type = type
      this.idtoshare = idfichier
      this.showPopup = true;
      this.reloaddata()

    },
    async reloaddata(){
      this.sharedusers = await FoldersFunc.GetSharedFoldersDetails(this.idtoshare)
      this.sharedusers.forEach(user => {
        user.profilepic = UserFunc.API_URL + '/profilpicture/' + user.profilepic
      });
    },
    closePopup() {
      this.showPopup = false;
    },
    async getSharedLink(){
      if(this.idtoshare && this.type === "dossier"){
        let result = await FoldersFunc.ShareFolder(this.idtoshare,this.mail)
        return result
      }
    },
    async remove(email){
      this.mail = email
      await this.share()
      this.mail = ''
      await this.reloaddata()
    },
    async share(){
      let result = await this.getSharedLink()
      if(result){
        this.popuptype = "success"
        this.error = "Votre requète a été prise en compte !"
        await this.reloaddata()
        this.$emit('reload')
      }else{
        this.popuptype = "error"
        this.error = "Une erreur est survenue"
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
