export default class UserUtils{
  static disconnect(){
    sessionStorage.setItem('monToken', '');
  }
  static async CheckUserInfo(){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch("http://localhost:5000/User/quisuisje",{
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

  static  isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  }

  static async GetContentInDirectory(directory){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch("http://localhost:5000/Files/GetContentInDirectory/" + directory,{
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
      const response = await fetch("http://localhost:5000/Files/GetDirectory",{
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

  static async ChangePDP(file) {
    const token = sessionStorage.getItem('monToken');

    if (token) {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('file', file);

      try {
        const response = await fetch("http://localhost:5000/Files/UploadProfilPic", {
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



  static async UploadFiles(directoryid,file) {
    const token = sessionStorage.getItem('monToken');

    if (token) {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('directoryid', directoryid)
      formData.append('file', file);

      try {
        const response = await fetch("http://localhost:5000/Files/UploadFile", {
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

  static async CreateFolder(subdirectory,name){
    const token = sessionStorage.getItem('monToken');
    const response = await fetch("http://localhost:5000/Files/NewDirectory",{
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

static async ActivateAccount(activationcode){
  const response = await fetch("http://localhost:5000/User/ActivateAccount",{
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

static async DeleteFolder(subdirectory){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch("http://localhost:5000/Files/RemoveDirectory",{
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





  static async Login(mail,password){
      const response = await fetch("http://localhost:5000/User/connecter",{
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

  static async Register(mail,password){
    const response = await fetch("http://localhost:5000/User/NouveauUtilisateur",{
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

}


