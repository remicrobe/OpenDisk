<template>
  <v-dialog v-model="showPopup" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline">Changer votre mot de passe</v-card-title>
      <v-card-text>
        <v-alert v-if="error" :text="error" :type="popuptype"></v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-form @submit.prevent :fast-fail=true>
          <v-text-field label="Mot de passe" :rules="notBlank" :loading="loading" v-model="password" type="password" variant="outlined" required></v-text-field>
          <v-text-field label="Confirmation du mot de passe" :rules="confirmPWD" :loading="loading" v-model="confirmpassword" type="password" variant="outlined" required></v-text-field>
          <v-btn type="submit" :disabled="!validButton" :loading="loading" block class="mt-2" @click="setNewPassword">Valider</v-btn>
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
      showPopup: true,
      loading: false,
      mail: '',
      error: '',
      password: '',
      confirmpassword: '',
      popuptype:  'success' as 'success' | 'error',
      validButton: true,
      notBlank: [
        (value:string) => {
          if (value) return true

          return 'Veuillez entrer votre mot de passe.'
        },
      ],
      confirmPWD: [
      (value:string) => {

          if (value && value === this.password) return true
            return 'Votre mot de passe ne correspond pas.'
        },
      ],
    };
  },
  methods: {
    closePopup() {
      this.$router.push('/')
    },
    async setNewPassword(){
      this.loading = true
      let Response = await UserUtils.RecoverPassword(this.$route.params.recoverycode as string,this.confirmpassword)
      console.log(Response)
      if(Response.sucess){
        this.popuptype = "success"
        this.error = Response.sucess.sucess
      }else if(Response.erreur){
        this.popuptype = "error"
        this.error = Response.erreur.erreur
      }
      this.loading = false

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
