<template>



 <v-container class="grid-container">
  <v-card
    class="grid-item"
    variant="outlined"
    color="indigo"
    v-for="folder in folders" :key="folder.idDirectory"
  >
    <v-card-item >
       <div class="text-overline mb-1">
          Dossier
        </div>
        <div class="text-caption">{{folder.DirectoryName}}</div>
    </v-card-item>

    <v-card-actions class="options-tools">

      <v-btn variant="outlined" @click="$router.push('/myFiles/' + folder.idDirectory)">
        Ouvrir
      </v-btn>
      <v-btn color="grey">
        ...
        <v-menu activator="parent" location="start">
          <v-list>
            <v-list-item>
              <v-list-item-title @click="this.$refs.RenamePopUpVue.openPopup('dossier',folder.DirectoryName,folder.idDirectory)">Renommer</v-list-item-title>
              <v-list-item-title @click="this.$refs.ConfirmDeletePopUpVue.openPopup('dossier',folder.DirectoryName,folder.idDirectory)">Supprimer</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-btn>
    </v-card-actions>
  </v-card>
  <v-card

  class="grid-item"
    variant="outlined"
    color="indigo"
    v-for="file in files" :key="file.idFichier"
  >

    <v-card-item >
       <div class="text-overline mb-1">
          Fichier
        </div>
        <div class="text-caption">{{file.nomFichierOriginal}}</div>
    </v-card-item>

    <v-card-actions class="options-tools">
      <v-btn variant="outlined" @click="downloadFiles(file.idFichier,file.nomFichierOriginal)">
        OUVRIR
      </v-btn>
      <v-btn color="grey">
        ...
        <v-menu activator="parent" location="start">
          <v-list>
            <v-list-item>
              <v-list-item-title @click="this.$refs.RenamePopUpVue.openPopup('fichier',file.nomFichierOriginal,file.idFichier)">Renommer</v-list-item-title>
              <v-list-item-title @click="this.$refs.ConfirmDeletePopUpVue.openPopup('fichier',file.nomFichierOriginal,file.idFichier)">Supprimer</v-list-item-title>
              <v-list-item-title @click="this.$refs.SharePopUp.openPopup('fichier',file.idFichier)">Partager</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-btn>

    </v-card-actions>

  </v-card>

  <RenamePopUpVue ref="RenamePopUpVue"></RenamePopUpVue>
  <RenamePopUpVue ref="RenamePopUpVue"></RenamePopUpVue>
  <SharePopUp ref="SharePopUp"></SharePopUp>
</v-container>


</template>


<script lang="ts">
  import UserUtils,{TypeFile,TypeFolder} from '@/utils/UserFunc'
  import RenamePopUpVue from './FilesFoldersOptions/RenamePopUp.vue'
  import ConfirmDeletePopupVue from './FilesFoldersOptions/ConfirmDeletePopup.vue'
  import SharePopUp from './FilesFoldersOptions/SharePopUp.vue'
export default{
  components: {
    RenamePopUpVue,
    ConfirmDeletePopupVue,
    SharePopUp
  },
  data(){
    return{
      files: [] as TypeFile[],
      folders: [] as TypeFolder[],
      originalfiles: [] as TypeFile[],
      originalfolders: [] as TypeFolder[]

    }
  },
  async created() {
    await this.getContents();

  },methods:{
    async getContents(){
    if(this.$route.params.id){
        let content = await UserUtils.GetContentInDirectory(parseInt(this.$route.params.id as string))
        if(content){
          this.files = content.files
          this.folders = content.folder
          this.originalfiles = this.files
          this.originalfolders = this.folders
          console.log(this.folders)
        }
      }else{
        let content = await UserUtils.GetMainFolder()
        if(content){
          this.folders = content

          this.files = [] as TypeFile[]
          this.originalfiles = this.files
          this.originalfolders = this.folders

        }
      }
    },
    async downloadFiles(idFichier:number, nomFichierOriginal:string) {
    try {
        const fileId = idFichier;
        const fileName = nomFichierOriginal;
        const authToken:string = sessionStorage.getItem('monToken') || "0";
        const redirectUrl = `${UserUtils.API_URL}/Files/GetFile/${fileId}/${fileName}`;

        const response = await fetch(redirectUrl, {
            method: 'GET',
            headers: {
                'token': authToken
            }
        });

        if (response.status === 200) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error('Une erreur est survenue', error);
    }
}


  },  watch: {
    '$route.params.id'(newValue, oldValue) {
      this.getContents();
    },
    'datatosearch'(n,o){

        this.files = this.originalfiles;
        this.folders = this.originalfolders;
      console.log(process.env.VUE_APP_ENV_VARIABLE)
      this.files= this.files.filter((file:TypeFile)=>{ return file.nomFichierOriginal.includes(this.datatosearch) })
      this.folders= this.folders.filter((folder:TypeFolder)=>{ return folder.DirectoryName.includes(this.datatosearch)})
    }

  },props: ['datatosearch']

}


</script>

<style>
/* Styles CSS personnalisés */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Colonnes dynamiques avec largeur minimale de 150px */
  gap: 20px; /* Espacement entre les éléments */
  grid-auto-rows: 1fr /* Force tout les élements a la m^ taille */


}
.v-card .options-tools{
  margin-bottom: 1;
  position: absolute;
  bottom: 0;
  right:0
}

.text-caption{
  padding-bottom: 20%;
}


/* Style des notes */
.grid-item {
  border: 1px solid #ccc;
  padding: 15px;
  background-color: #f5f5f5;

}

@media screen and (max-width: 1280px){
  .grid-container {
  padding-left: 17%;
}
}
</style>
