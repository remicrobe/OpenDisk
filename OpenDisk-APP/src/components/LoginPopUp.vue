<template>
  <v-dialog v-model="showPopup" max-width="500px">
    <v-card>
      <v-card-title class="headline">Se connecter</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-form @submit.prevent fast-fail="true">
          <v-text-field label="E-mail" :loading="loading" :rules="emailRules" v-model="mail" variant="outlined" required></v-text-field>
          <v-text-field label="Mot de passe" :rules="notBlank" :loading="loading" v-model="password" type="password" variant="outlined" required></v-text-field>
          <v-btn type="submit" :loading="loading" block class="mt-2" @click="login">Se connecter</v-btn>
      </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="RecoveryLink">Mot de passe oublié</v-btn>
        <v-btn color="primary" @click="closePopup">Fermer</v-btn>
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
      error: '',
      password: '',
      popuptype: "error",
      notBlank: [
        value => {
          if (value) return true

          return 'Veuillez entrer votre mot de passe.'
        },
      ],
      emailRules: [
        value => {
          if (value) return true

          return 'Saisissez un mail ..'
        },
        value => {
          if (/.+@.+\..+/.test(value)) return true

          return 'Saisissez un mail valide ..'
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
    async login(){
      this.loading = true
      console.log(this.mail)
      let Userinfo = await UserUtils.Login(this.mail,this.password)
      if(Userinfo.sucess){
        this.popuptype = "success"
        this.error = "Vos informations de connexions sont correct !"
        window.location.reload();
      }else if(Userinfo.erreur){
        console.log(Userinfo.erreur)
        this.error = Userinfo.erreur.erreur

      }else{
        this.error = "Vos informations ne semblent pas correct !"
      }
      this.loading = false;

    },
    async RecoveryLink(){
      if(this.mail){
        this.loading = true
        let Recovery = await UserUtils.RecoveryLink(this.mail)
        if(Recovery.sucess){
          this.popuptype = "success"
          this.error = Recovery.sucess.sucess
          this.loading = false
        }else if(Recovery.erreur){
          this.popuptype = "error"
          this.error = Recovery.erreur.erreur
          this.loading = false
        }
      }else{
        this.popuptype = "error"
          this.error = "Veuillez entrer un mail"

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
