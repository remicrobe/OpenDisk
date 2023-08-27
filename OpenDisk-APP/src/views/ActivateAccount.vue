<template>
  <h1> {{msg}} </h1>
  <HelloPage />
</template>

<script>

  import HelloPage from '@/components/HelloPage.vue'
    import UserUtils from '@/utils/UserFunc.js'

export default {
  data() {
    return {
      msg: ''
    }
  },
  async created() {
    console.log('okk')
    let AccountActivated = await UserUtils.ActivateAccount(this.$route.params.activationcode)
    if(AccountActivated){
      this.msg = "Votre compte a été activé"
      await delay(2000);
      this.$router.push('/')
    }else{
      this.msg = "Une erreur est survenue"
      await delay(2000);
      this.$router.push('/')
    }
  }
}

</script>
