export default class UtilsFunc{
  // METHODE RELATIVE A L'UX
  static  isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true
    } else {
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
