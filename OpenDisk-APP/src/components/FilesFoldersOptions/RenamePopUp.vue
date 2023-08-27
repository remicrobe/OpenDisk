<template>
  <v-dialog v-model="showPopup" max-width="500px">
    <v-card>
      <v-card-title class="headline">Renommer {{ nametoedit }}</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-form @submit.prevent :fast-fail=true>
          <v-text-field label="Nouveau nom" :rules="notBlank" :loading="loading" v-model="newname" variant="outlined" required></v-text-field>
          <v-btn type="submit" :loading="loading" block class="mt-2" @click="rename">Renommer</v-btn>
      </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
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
      mail: '',
      error: '',
      type: '',
      idtoedit: 0,
      nametoedit: '',
      newname: '',
      popuptype:  'error' as 'success' | 'error',
      notBlank: [
        (value:string) => {
          if (value) return true

          return 'Veuillez entrer un nouveau nom.'
        },
      ],
    };
  },
  methods: {
    openPopup(type:string, nom:string, id:number) {

      this.type = type
      this.idtoedit = id
      this.nametoedit = nom

      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    async rename(){
      if(this.type && this.idtoedit && this.nametoedit && this.newname){
        if(this.type === 'fichier'){
          let renameFile = await UserUtils.RenameFile(this.idtoedit, this.newname)
          if(renameFile){
            this.popuptype = "success"
            this.error = "Votre fichier a bien été renommé"
          }else{
            this.popuptype = "error"
            this.error = "Une erreur est survenue"
          }
        }else if(this.type === 'dossier'){
          let renameFile = await UserUtils.RenameFolder(this.idtoedit, this.newname)
          if(renameFile){
            this.popuptype = "success"
            this.error = "Votre dossier a bien été renommé"
          }else{
            this.popuptype = "error"
            this.error = "Une erreur est survenue"
          }
        }
      }
    },
  },
  watch: {
    'error'(newValue){
      setTimeout(()=>{
        this.error = ''
        if(this.popuptype==='success'){
          location.reload()
        }
      },1000)
    }
  }
};
</script>
