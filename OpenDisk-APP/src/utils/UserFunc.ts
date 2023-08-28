export default class UserUtils{
  static API_URL = "http://localhost:5000"




  // METHODES RELATIVES A L' UTILISATEUR


  static disconnect(){
    sessionStorage.setItem('monToken', '');
  }
  static async CheckUserInfo(){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch(this.API_URL + "/User/quisuisje",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token:token}),
      })

      const result = await response.json()

      if(response.ok){
        return result.Utilisateur
      }else{
        return false
      }
    }else return false
  }


  static async ChangePDP(file:File) {
    const token = sessionStorage.getItem('monToken');

    if (token) {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('file', file);

      try {
        const response = await fetch(this.API_URL + "/Files/UploadProfilPic", {
          method: "POST",
          headers: {},
          body: formData,
        });

        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la requête :", error);
        return false;
      }
    } else {
      return false;
    }
  }


static async ActivateAccount(activationcode:string){
  const response = await fetch(this.API_URL + "/User/ActivateAccount",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ActivationCode:activationcode}),

  })



  if(response.ok){
    return true
  }else{
    return false
  }

}
static async RecoveryLink(mail:string){
  const response = await fetch(this.API_URL + "/User/LienDeRecuperation",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: mail }),

  })

  const result = await response.json()

  if(response.ok){
    return {sucess:result}
  }else{
    return {erreur:result}
  }

}

static async RecoverPassword(RecoveryCode:string, password:string){
const response = await fetch(this.API_URL + "/User/EditPassword",{
  method:"POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ RecoveryCode: RecoveryCode, password: password}),

})

const result = await response.json()

if(response.ok){
  return {sucess:result}
}else{
  return {erreur:result}
}

}




static async Login(mail:string,password:string){
    const response = await fetch(this.API_URL + "/User/connecter",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: mail, mdp: password }),

    })

      const result = await response.json()

      if(response.ok){
        sessionStorage.setItem('monToken', result.uuid);
        console.log(result.uuid)
        return {sucess:result}
      }else{
        return {erreur:result}
      }

  }

  static async Register(mail:string,password:string){
  const response = await fetch(this.API_URL + "/User/NouveauUtilisateur",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: mail, mdp: password }),

  })

  const result = await response.json()

  if(response.ok){
    sessionStorage.setItem('monToken', result.uuid);
    console.log(result.uuid)
    return {sucess:result}
  }else{
    return {erreur:result}
  }

  }


  // METHODE RELATIVE A L'UX
  static  isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  }

  // METHODES RELATIVES AUX FICHIERS/DOSSIERS

  static async GetSharedLink(fileid:number){
    const token = sessionStorage.getItem('monToken');
    if(!token) return false

    const response = await fetch(this.API_URL + "/Files/ShareFile",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, idfile:fileid }),

    })

    const result = await response.json()

    if(response.ok){
      return {sucess:result}
    }else{
      return {erreur:result}
    }
  }

  static async GetContentInDirectory(directory:number){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch(this.API_URL + "/Files/GetContentInDirectory/" + directory,{
        method:"GET",
        headers:{
          "token": token
        }
      })

      const result = await response.json()

      if(response.ok && result.files){
        return result
      }else{
        return false
      }
    }else return false
  }



  static async GetMainFolder(){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch(this.API_URL + "/Files/GetDirectory",{
        method:"GET",
        headers:{
          "token": token
        }
      })

      const result = await response.json()

      if(response.ok && result.folder){
        return result.folder
      }else{
        return false
      }
    }else return false
  }

  static async UploadFiles(directoryid:number,file:File) {
    const token = sessionStorage.getItem('monToken');

    if (token) {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('directoryid', directoryid.toString())
      formData.append('file', file);

      try {
        const response = await fetch(this.API_URL + "/Files/UploadFile", {
          method: "POST",
          headers: {},
          body: formData,
        });

        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la requête :", error);
        return false;
      }
    } else {
      return false;
    }
  }

  static async CreateFolder(subdirectory:number,name:string){
    const token = sessionStorage.getItem('monToken');
    const response = await fetch(this.API_URL + "/Files/NewDirectory",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, FolderName: name, subdirectoryID:subdirectory}),

    })



    if(response.ok){
      return true
    }else{
      return false
    }

}


static async DeleteFolder(subdirectory:number){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(this.API_URL + "/Files/RemoveDirectory",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, directoryId: subdirectory}),

  })



  if(response.ok){
    return true
  }else{
    return false
  }

}

static async DeleteFile(fileID:number){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(this.API_URL + "/Files/RemoveFile",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, fileID: fileID}),

  })



  if(response.ok){
    return true
  }else{
    return false
  }

}
static async RenameFolder(idFolder:number,newname:string){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(this.API_URL + "/Files/RenameFolder",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, idFolder: idFolder,newname:newname}),

  })
  if(response.ok){
    return true
  }else{
    return false
  }
}

static async RenameFile(idfile:number,newname:string){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(this.API_URL + "/Files/RenameFile",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, idfile: idfile,newname:newname}),

  })
  if(response.ok){
    return true
  }else{
    return false
  }
}


}


export interface TypeFolder {
  idDirectory: number;
  DirectoryName: string;
  SubDirectoryID:number
}
export interface TypeFile {
  idFichier: number;
  nomFichier: string;
  nomFichierOriginal:string
  IdDirectory:string
}
