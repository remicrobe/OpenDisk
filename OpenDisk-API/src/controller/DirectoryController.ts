import { AppDataSource } from "../data-source";
import { Directory } from "../entity/Directory";
import { UserController } from "./UserController";


export class DirectoryController{

    static async DirectoryOwner(UserID,DirectoryID){
        const myDirectory = await AppDataSource.getRepository(Directory).findOneBy({idDirectory:DirectoryID, ownerID: UserID})
        if(myDirectory){
            return myDirectory
        }else{
            return false
        }
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


 
            await AppDataSource.getRepository(Directory).remove(directory);
            return true; // Directory deleted successfully
        } catch (err) {
          
            return false; // Error occurred during the deletion process
        }
    }

}