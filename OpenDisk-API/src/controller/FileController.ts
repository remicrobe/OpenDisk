import { File } from "../entity/File";
import { AppDataSource } from "../data-source";
import * as multer from 'multer'
import * as path from 'path'
import { cp } from "fs";
import { DirectoryController } from "./DirectoryController";
import { UserController } from "./UserController";
import { Directory } from "../entity/Directory";
import { IsNull } from "typeorm";
import * as fs from 'fs'
import { SharedLink } from "../entity/SharedLink";
import { randomUUID } from "crypto";

export class FileController{





    static async getFile(){
        return await AppDataSource.getRepository(File).find()
    }

    static async RemoveFileInDirectory(directory:Directory){
      const myFiles = await AppDataSource.getRepository(File).findBy({directory:directory})
      myFiles.forEach(async file => {
        console.log(file)
        fs.unlink(path.resolve('src/uploads/' + file.nomFichier), (err)=> {console.log(err)})
        await AppDataSource.getRepository(File).remove(file)
      }); 
    }
    static async deleteFile(fileID, token) {
      try {
        let myFile = await this.isFileToUser(fileID,token)
        if(myFile){
          await AppDataSource.getRepository(File).remove(myFile)
          return true
        }else{
          return false
        }
      } catch (err) {
        return false
      }
    }

    static async isFileToUser(fileID, token){
      
      const UserID = await UserController.GetUseriDFromToken(token)
      
      if(!UserID)
        return false

      const myFile = await AppDataSource.getRepository(File).createQueryBuilder("file").where("file.ownerID = :UserID AND file.idFichier = :fileID",{UserID,fileID}).getOne()
      
      if(myFile) return myFile
      else return false


    }

    static async RenameFile(fileid, token, newname){
      try {
        const FileToUser = await this.isFileToUser(fileid,token)
  
        if(FileToUser){
          FileToUser.nomFichierOriginal = newname
          await AppDataSource.getRepository(File).save(FileToUser)
          return true
        }
        return false
      } catch (err) {
        return false
      }
    }

    static async FilesInDirectory(folderID, token){
      
      const UserID = await UserController.GetUseriDFromToken(token)
      if(!UserID) return null

      const myDirectory = await DirectoryController.DirectoryOwner(UserID,folderID)
      if(!myDirectory) return null
      

      const myFiles = await AppDataSource.getRepository(File).findBy({directory:myDirectory, ownerID:UserID})
      
      if(!myFiles) return false
      
      myFiles.forEach((myFile)=>{
        delete myFile.nomFichier
      })

      return myFiles



    }

    static async FolderInFolder(folderID, token){
      
      const UserID = await UserController.GetUseriDFromToken(token)
      if(!UserID) return null


      const myDirectory = await AppDataSource.getRepository(Directory).createQueryBuilder("directory").where("directory.ownerID = :ownerID and SubDirectoryID = :folderID", { ownerID:UserID,folderID:folderID }).getMany();
      if(!myDirectory) return null
      return myDirectory
      

    



    }


    static async ShareFile(fileID:number,token:string){
      try {
        const File = await this.isFileToUser(fileID,token)
        if(File) {
          const OldShare = await AppDataSource.getRepository(SharedLink).createQueryBuilder("sharedlink").where("fileIdFichier = :fileID", { fileID }).getOne()
          if(OldShare) await AppDataSource.getRepository(SharedLink).remove(OldShare)
          const NewSharedFile = new SharedLink
          NewSharedFile.token = randomUUID()
          NewSharedFile.file = File
          await AppDataSource.getRepository(SharedLink).save(NewSharedFile)
          return NewSharedFile
        }
        return false
      } catch (err) {
        return false
      } 

    }

    static async getSharedFile(token: string) {
      return await AppDataSource.getRepository(SharedLink).createQueryBuilder("sharedlink").innerJoinAndSelect("sharedlink.file","file").where("token = :token", { token }).getOne()
    }

    static async GetFolders(token){

      const UserID = await UserController.GetUseriDFromToken(token)
      if(!UserID) return null

      const myDirectory = await AppDataSource.getRepository(Directory).createQueryBuilder("directory").where("directory.ownerID = :ownerID and SubDirectoryID is NULL", { ownerID:UserID }).getMany();
      console.log(myDirectory)
      if(!myDirectory) return null
      return myDirectory
      

    



    }

    static storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.resolve('src/uploads'))
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null,  uniqueSuffix + '-' + file.originalname)
        }
      })


      static tokenFilter = async (req, file, callback) => {
        console.log(req.body)
        // Vérifier le token ici (ex. en utilisant un middleware d'authentification)
        try{
        const token = req.body.token; // Assure-toi d'adapter cette ligne en fonction de ta structure de requête
        const directory = req.body.directoryid
        if(directory && token){

        const UserID = await UserController.GetUseriDFromToken(token)
        const DirectoryIsValid = await DirectoryController.DirectoryOwner(UserID, directory)
        
        if (DirectoryIsValid) { // Remplace "ton_token_secret" par la valeur attendue du token
            callback(null, true); // Autoriser le fichier à être téléchargé
        } else {
            callback(new Error('Le répertoire ne vous appartient pas'));
        } 
      } else {
        callback(new Error('Les arguments fournis ne sont pas correct'));
    }
      }catch(err){
        callback(new Error('Token invalide'));
      } 
    };

    static upload = multer({ storage: FileController.storage, fileFilter: FileController.tokenFilter })


    static storagedp = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.resolve('src/profilepic'))
      },
      filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9 ) + '-' + file.originalname
        cb(null,  fileName)
      }
    })


    static tokenFilterdp = async (req, file, callback) => {
      console.log(req.body)
      // Vérifier le token ici (ex. en utilisant un middleware d'authentification)
      try{
      const token = req.body.token; // Assure-toi d'adapter cette ligne en fonction de ta structure de requête
      if( token){

      const UserID = await UserController.GetUseriDFromToken(token)
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        callback( new Error('Please upload a valid image file'))
      }
      if (UserID) { // Remplace "ton_token_secret" par la valeur attendue du token
          callback(null, true); // Autoriser le fichier à être téléchargé
      } else {
          callback(new Error('Token invalide'));
      }
    } else {
      callback(new Error('Token non fourni'));
    }
    }catch(err){
      callback(new Error('Token invalide'));
    }
  };
  //TODO Verifier la taille du fichier directement dans le filtre, et la recadrer au format image  (avec sharp ????)
  static uploaddp = multer({ storage: FileController.storagedp, limits:{fileSize:50 * 1024 * 1024}, fileFilter: FileController.tokenFilterdp })



}