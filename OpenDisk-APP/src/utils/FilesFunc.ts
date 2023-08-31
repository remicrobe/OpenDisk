import UserFunc from "./UserFunc";

export default class FilesFunc{
  static async GetSharedLink(fileid:number){
    const token = sessionStorage.getItem('monToken');
    if(!token) return false

    const response = await fetch(UserFunc.API_URL + "/Files/ShareFile",{
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


  static async UploadFiles(directoryid:number,file:File) {
    const token = sessionStorage.getItem('monToken');

    if (token) {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('directoryid', directoryid.toString())
      formData.append('file', file);

      try {
        const response = await fetch(UserFunc.API_URL + "/Files/UploadFile", {
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


static async DeleteFile(fileID:number){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(UserFunc.API_URL + "/Files/RemoveFile",{
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


static async RenameFile(idfile:number,newname:string){
  const token = sessionStorage.getItem('monToken');
  const response = await fetch(UserFunc.API_URL + "/Files/RenameFile",{
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
