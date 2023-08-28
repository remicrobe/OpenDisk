<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer class="navigation-bar"
        expand-on-hover
        rail
        permanent

      >

        <v-list  v-if="login">
          <v-list-item
            :prepend-avatar="profilpic"
            title="Utilisateur"
            :subtitle="email"
            @click="this.$refs.infoPopup.openPopup();"

          ></v-list-item>

        </v-list>
        <v-list density="compact" nav v-else>
          <v-list-item prepend-icon="mdi-folder" title="Se connecter" value="connect" @click="this.$refs.loginPopup.openPopup();"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="S'inscrire" value="inscrire" @click="this.$refs.registerpopup.openPopup();" ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav v-if="login">
          <v-list-item prepend-icon="mdi-folder" @click="$router.push('/')" title="Home" value="Home"></v-list-item>
          <v-list-item prepend-icon="mdi-folder" @click="$router.push('/myFiles')" title="My Files" value="myfiles"></v-list-item>
        </v-list>

              <v-divider></v-divider>
        <v-list density="compact" nav v-if="login" >
          <v-list-item v-for="folder in folders" prepend-icon="mdi-folder" @contextmenu="show($event, folder.idDirectory)" @click="$router.push('/myFiles/' + folder.idDirectory)" :title="folder.DirectoryName" :key="folder.idDirectory" :value="folder.idDirectory"></v-list-item>

        </v-list>
      <v-menu anchor="bottom end"  v-model="showMenu" :style="{position: 'fixed', top: y + 'px', left: x + 'px', 'z-index': 999969}">
              <v-list>
                <v-list-item  >
                  <v-list-item-title @click="deletefolder">Supprimer ce dossier</v-list-item-title>
                </v-list-item>
              </v-list>
        </v-menu>

      </v-navigation-drawer>


      <RegisterPopUp ref="registerpopup"></RegisterPopUp>
      <LoginPopUp ref="loginPopup"></LoginPopUp>
      <UserInfoPopUp ref="infoPopup" @reload-parent="reload()"></UserInfoPopUp>

    </v-layout>
  </v-card>

</template>


<script lang="ts">

  import UserUtils,{TypeFolder} from '@/utils/UserFunc'
  import LoginPopUp from '@/components/LoginPopUp.vue'
  import RegisterPopUp from '@/components/RegisterPopUp.vue'
  import UserInfoPopUp from '@/components/UserInfoPopUp.vue'



  interface Folder {
    idDirectory: number;
    DirectoryName: string;
  }
export default{
  components:{
    LoginPopUp,
    UserInfoPopUp,
    RegisterPopUp
  },
  data() {
    return {
      login: false,
      email: '',
      profilpic: '',
      folders: [] as TypeFolder[],
      showMenu: false,
      x: 20,
      y: 50,
      foldertodelete: 0,
    };
  },
  methods: {
    async reload(){
    let userinfo = await UserUtils.CheckUserInfo()
      if(userinfo){
        this.login = true
        userinfo = JSON.parse(userinfo)
        this.email = userinfo.email
        this.profilpic = UserUtils.API_URL +"/profilpicture/" + userinfo.profilepic
    }
    },
    show(e: MouseEvent, idfolder: number) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.foldertodelete = idfolder;
      this.showMenu = true;
    },
  async deletefolder(){
    let deletedfolder = await UserUtils.DeleteFolder(this.foldertodelete)
    console.log(this.folders)
    if(deletedfolder){
      this.folders = this.folders.filter((folder:Folder)=>{
        if(folder.idDirectory !== this.foldertodelete)
          return true
      })

      if(parseInt(this.$route.params.id as string) === this.foldertodelete){
        this.$router.push('/myFiles/')
      }
    }
  }
  },
  async created() {
    let userinfo = await UserUtils.CheckUserInfo()
    if(userinfo){
      this.login = true
      userinfo = JSON.parse(userinfo)
      this.email = userinfo.email
      this.profilpic = UserUtils.API_URL + "/profilpicture/" + userinfo.profilepic
      let userfolder = await UserUtils.GetMainFolder()
      this.folders=userfolder
      console.log(this.folders)
    }else{
      this.$router.push('/')
    }

  },

}


</script>

