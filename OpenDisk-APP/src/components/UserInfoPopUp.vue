<template>
  <v-dialog v-model="showPopup" max-width="500px" style="z-index:999999999999">
    <v-card>
      <v-card-title class="headline">Modifier vos infos</v-card-title>
      <v-card-text>
         <v-alert v-if="info" :text="info" :type="sucess"></v-alert>

           <v-file-input  accept="image/*" label="Modifier votre photo de profil" v-model="selectedFile"></v-file-input>

      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
        <v-btn color="primary" @click="disconnect">Se déconnecter</v-btn>
        <v-btn color="primary" @click="sauvegarder">Sauvegarder</v-btn>
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
      mail: '',
      info: '',
      sucess: '',
      selectedFile: '',
      password: '',
      popuptype: "error",
      notBlank: [
        value => {
          if (value) return true

          return 'Veuillez entrer votre mot de passe.'
        },
      ],
    };
  },
  methods: {
    async sauvegarder(){
      console.log(this.selectedFile[0])
      let result = await UserUtils.ChangePDP(this.selectedFile[0])
      if(result){
        this.$emit('reload-parent');
        this.info = "Votre modification a bien été prise en compte"
        this.sucess = "success"
      }else{
        this.info = "Une erreur est survenue"
        this.sucess = "error"
      }
    },
    disconnect(){
      UserUtils.disconnect()
      window.location.reload();
    },
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
  },
};
</script>
