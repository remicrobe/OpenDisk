<template>
  <h1> {{msg}} </h1>
  <HelloPage />
</template>

<script lang="ts">

import HelloPage from '@/components/DisplayComponents/HelloPage.vue'
import UserFunc from '@/utils/UserFunc'

export default {
  data() {
    return {
      msg: ''
    }
  },
  async created() {
    console.log('okk')
    let AccountActivated = await UserFunc.ActivateAccount(this.$route.params.activationcode as string)
    if(AccountActivated){
      this.msg = "Votre compte a été activé"
    }else{
      this.msg = "Une erreur est survenue"
      this.$router.push('/')
    }
  }
}

</script>
