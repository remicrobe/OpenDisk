<template>
  <v-dialog v-model="showPopup" max-width="500px">
    <v-card>
      <v-card-title class="headline">S'inscrire</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-form @submit.prevent>
          <v-text-field label="E-mail" :loading="loading" :rules="emailRules" v-model="mail" variant="outlined" required></v-text-field>
          <v-text-field label="Mot de passe" :rules="notBlank" :loading="loading" v-model="password" type="password" variant="outlined" required></v-text-field>
          <v-text-field label="Confirmation du mot de passe" :rules="confirmPWD" :loading="loading" v-model="confirmpassword" type="password" variant="outlined" required></v-text-field>
          <v-btn type="submit" :disabled="!validButton" :loading="loading" block class="mt-2" @click="register">S'inscrire</v-btn>
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
      password: '',
      confirmpassword: '',
      popuptype: 'success' as 'success' | 'error',
      validButton: true,
      notBlank: [
        (value:string) => {
          if (value) return true

          return 'Veuillez entrer votre mot de passe.'
        },
      ],
      confirmPWD: [
        (value:string) => {

          if (value && value === this.password as unknown as string) return true
            return 'Votre mot de passe ne correspond pas.'
        },
      ],
      emailRules: [
      (value:string) => {
          if (value) return true

          return 'Saisissez un mail ..'
        },
        (value:string) => {
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
    async register(){
      this.loading = true
      console.log(this.mail)
      let Userinfo = await UserUtils.Register(this.mail,this.password)
      if(Userinfo.sucess){
        this.popuptype = "success"
        this.error = Userinfo.sucess.sucess

      }else if(Userinfo.erreur){
        console.log(Userinfo.erreur)
        this.error = Userinfo.erreur.erreur

      }else{
        this.error = "Vos informations ne semblent pas correct !"
      }
      this.loading = false;

    }
  },  watch: {
    'error'(newValue){
      setTimeout(()=>{
        this.error = ''
      },3000)
    }
  }
};
</script>
