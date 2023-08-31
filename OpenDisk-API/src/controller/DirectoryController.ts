import { AppDataSource } from "../data-source";
import { Directory } from "../entity/Directory";
import { SharedFolders } from "../entity/SharedFolders";
import { Utilisateur } from "../entity/User";
import { FileController } from "./FileController";
import { UserController } from "./UserController";


export class DirectoryController{
    static async GetSharedFolders(token) {
        const UserID = await UserController.GetUserFromToken(token)
        if(!UserID) return null
        delete UserID.dateCreation // POURQUOI ???? CAR SI JE NE FAIS PAS CA TYPEORM NE MARCHE PAS
        const sharedFoldersExist = await AppDataSource.getRepository(SharedFolders).find({
            relations:{
                directory:true,
                sharedUsers: true
            },
            where:{
                sharedUsers:UserID
            } 
        }) 
    

        if(!sharedFoldersExist) return []
        let sharedfolder= []
        sharedFoldersExist.forEach((s)=>sharedfolder.push(s.directory))
        return sharedfolder
        
    }

    static async ShareFoldersDetails(idfolder, usertoken) {
        try {
            const requestFrom = await UserController.GetUserFromToken(usertoken)
            if(!requestFrom) return false
            const directory = await DirectoryController.DirectoryOwner(requestFrom.idUtilisateur,idfolder)
            if(!directory) return false
                const sharedFoldersExist = await AppDataSource.getRepository(SharedFolders).findOne({
                    relations:{
                        directory:true,
                        sharedUsers: true
                    },
                    where:{
                        directory: directory,
                    } 
                }) 
                
                sharedFoldersExist.sharedUsers.forEach(user=> {
                    delete user.uuid // TODO remplacer tout ces delete par une fonction deleteSensitiveData(user:Utilisateur):Utilisateur
                    delete user.ActivationCode 
                    delete user.RecoveryCode
                    delete user.password
                    delete user.Activated
                    delete user.directory
                    delete user.files
                    delete user.idUtilisateur
                    delete user.dateCreation
                })    

            return sharedFoldersExist.sharedUsers
        } catch (err) {
            return false
        }
    }
    
    static async ShareFolders(idfolder: number, usertoken: string, usertoshare: string) {
        try {
            const requestFrom = await UserController.GetUserFromToken(usertoken)
            const requestFor = await UserController.GetUserFromMail(usertoshare)
            const directory = await AppDataSource.getRepository(Directory).findOneBy({idDirectory:idfolder})
            directory.shared = true;
            if(!requestFrom || !requestFor) return false
            if(requestFor.email === requestFrom.email) return false
            if(await this.DirectoryOwner(requestFrom.idUtilisateur,idfolder) && requestFrom && directory){
                const sharedFoldersExist = await AppDataSource.getRepository(SharedFolders).findOne({
                    relations:{
                        directory:true,
                        sharedUsers: true
                    },
                    where:{
                        directory: directory,
                    } 
                }) 
                
                await AppDataSource.getRepository(Directory).save(directory)
                if(sharedFoldersExist && sharedFoldersExist.sharedUsers.some((user)=> user.email === requestFor.email)){
                    sharedFoldersExist.sharedUsers = sharedFoldersExist.sharedUsers.filter((user)=> user.email !== requestFor.email)
                    await AppDataSource.getRepository(SharedFolders).save(sharedFoldersExist)
                    return true
                }else if(sharedFoldersExist){
                    sharedFoldersExist.sharedUsers.push(requestFor)
                    await AppDataSource.getRepository(SharedFolders).save(sharedFoldersExist)
                    return true
                }else{
                    const newSharedFolders = new SharedFolders
                    newSharedFolders.directory = directory
                    newSharedFolders.sharedUsers = [requestFor]
                    await AppDataSource.getRepository(SharedFolders).save(newSharedFolders)
                    return true
                } 
            }
            return false
        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async DirectoryOwner(UserID,DirectoryID){


        const myDirectory = await AppDataSource.getRepository(Directory).findOne({
            where:{
                idDirectory:DirectoryID
            },
            relations:['ownerID']
     
        }) 


   
        const sharedFolders = await AppDataSource.getRepository(SharedFolders).findOne({
            relations:{
                directory:true,
                sharedUsers: true
            },
            where:{
                directory: myDirectory,
            } 
        }) 
        if(sharedFolders){
            if(sharedFolders.sharedUsers.some((user)=>user.idUtilisateur===UserID)){
                console.log("Dossier partagé !")
                return myDirectory
            }
        }
        if(myDirectory){
            if(myDirectory.ownerID.idUtilisateur === UserID){
                console.log("Propriétaire du dossier !")
                return myDirectory
            }
        }
        console.log("rien")
        return false

    }


  
      static async RenameFolder(folderid, token, newname){
        try {
          const UserID = await UserController.GetUseriDFromToken(token)
          const FolderToUser = await this.DirectoryOwner(UserID,folderid)
    
          if(FolderToUser){
            FolderToUser.DirectoryName = newname
            await AppDataSource.getRepository(Directory).save(FolderToUser)
            return true
          }
          return false
        } catch (err) {
          return false
        }
      }

    static async CreateDirectory(subdirectoryid = 0, token, directoryname){
        try{
            const myNewDirectory = new Directory
            myNewDirectory.DirectoryName = directoryname
            const userid = UserController.GetUseriDFromToken(token)
            if(typeof userid != "number")
                return false  
                if(subdirectoryid !== 0){
                    const DirectoryOwner = await DirectoryController.DirectoryOwner(userid, subdirectoryid)
                    if(DirectoryOwner) myNewDirectory.SubDirectoryID = subdirectoryid
                    else return false
                }
                myNewDirectory.ownerID = userid
                await AppDataSource.getRepository(Directory).save(myNewDirectory)
                return true
        }catch (err){
            return false
        }

    }

    static async deleteDirectory(directoryId, token) {
        try {
            const directory = await AppDataSource.getRepository(Directory).findOneBy({idDirectory:directoryId});
           
            if (!directory) {
            
                return false; // Directory not found
            }

            const userId = await UserController.GetUseriDFromToken(token);

          
            if (typeof userId !== "number") {
                
                return false; // Invalid user ID
            } 
       
            if (await !this.DirectoryOwner(userId, directory.idDirectory)) {
               
                return false; // User is not the owner of the directory
            }
            

            const result = await this.removeSubDirectory(directory)
            //await AppDataSource.getRepository(Directory).remove(directory);
            return result; // Directory deleted successfully
        } catch (err) {
          
            return false; // Error occurred during the deletion process
        } 
    }  

    static async removeSubDirectory(directory:Directory, isSubDirectory=false){
        try {
            let subsdirectory = await AppDataSource.getRepository(Directory).findBy({SubDirectoryID:directory.idDirectory})
            console.log(subsdirectory)
            for (const subdirectory of subsdirectory) {
                await FileController.RemoveFileInDirectory(subdirectory);
                await this.removeSubDirectory(subdirectory,true);
                await AppDataSource.getRepository(Directory).remove(subdirectory);
            }
            if(!isSubDirectory){
                await FileController.RemoveFileInDirectory(directory)
                await AppDataSource.getRepository(Directory).remove(directory)
            }
            return true
        } catch (err) {
            return false  
        }
        
    }

}