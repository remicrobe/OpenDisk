export default class FoldersFunc{

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

}
