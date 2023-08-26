import { AppDataSource } from "../data-source";
import { Utilisateur } from "../entity/User";


export class UserController{

    static async GetUserFromToken(token){
        try{
            return await AppDataSource.getRepository(Utilisateur).findOneBy({uuid: token})
        }catch(err){
            return false
        }


    }

    static async GetUserToActivate(activationcode){
        try{
            if(activationcode)
                return await AppDataSource.getRepository(Utilisateur).findOneBy({ActivationCode: activationcode})
            else
            return false
        }catch(err){
            return false
        }

    }

    static async ActivateAccount(activationcode){
        try{
            let UserToActivate = await this.GetUserToActivate(activationcode)

            if(UserToActivate){
                UserToActivate.Activated = true
                UserToActivate.ActivationCode = ''
                await AppDataSource.getRepository(Utilisateur).save(UserToActivate)
                return true
            }
            return false
            
        }catch(err){
            return false
        }
    }

    static async GetUseriDFromToken(token){
        try{
            const myuser= await AppDataSource.getRepository(Utilisateur).findOneBy({uuid: token})
            if(myuser){
                return myuser.idUtilisateur
            }else{
                return false
            }
        }catch(err){
            return false
        }


    }

    static async TokenIsValid(token){
        try{
            const myuser= await AppDataSource.getRepository(Utilisateur).findOneBy({uuid: token})
            if(myuser){
                return true
            }else{
                return false
            }
        }catch(err){
            return false
        }


    }


}