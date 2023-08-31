export default class UserFunc{
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



  // METHODES RELATIVES AUX FICHIERS/DOSSIERS







}

