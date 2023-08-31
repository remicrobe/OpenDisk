import UserFunc from "./UserFunc";

export default class FoldersFunc{


  static async ShareFolder(idtoshare: string, usertoshare: string) {
    const token = sessionStorage.getItem('monToken');
    const response = await fetch(UserFunc.API_URL + "/Files/ShareFolders",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, idfolder: idtoshare, usertoshare:usertoshare}),

    })



    if(response.ok){
      return true
    }else{
      return false
    }
  }

  static async GetContentInDirectory(directory:number){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch(UserFunc.API_URL + "/Files/GetContentInDirectory/" + directory,{
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
      const response = await fetch(UserFunc.API_URL + "/Files/GetDirectory",{
        method:"GET",
        headers:{
          "token": token
        }
      })

      const result = await response.json()
      console.log(result)
      if(response.ok && result.folder){
        return result
      }else{
        return false
      }
    }else return false
  }

  static async GetSharedFoldersDetails(foldersid){
    const token = sessionStorage.getItem('monToken');
    console.log(token)
    if(token){
      const response = await fetch(UserFunc.API_URL + "/Files/GetSharedFoldersDetails",{
        method:"GET",
        headers:{
          "token": token,
          "idfolder": foldersid
        }
      })

      const result = await response.json()
      console.log(result.details)
      if(response.ok && result.details){
        return result.details
      }else{
        return false
      }
    }else return false
  }


  static async CreateFolder(subdirectory:number,name:string){
    const token = sessionStorage.getItem('monToken');
    const response = await fetch(UserFunc.API_URL + "/Files/NewDirectory",{
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
  const response = await fetch(UserFunc.API_URL + "/Files/RemoveDirectory",{
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



static async RenameFolder(idFolder:number,newname:string){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(UserFunc.API_URL + "/Files/RenameFolder",{
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

}
