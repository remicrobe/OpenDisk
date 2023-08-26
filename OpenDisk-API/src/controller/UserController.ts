import { randomUUID } from "crypto";
import { AppDataSource } from "../data-source";
import { Utilisateur } from "../entity/User";
import { sendActivationMail } from "../mail-tools";
import { erreur } from "../utils/Utils";


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

    static async CreateUser(mail,password){
        try{
            var NouvelleUtilisateur = new Utilisateur();
            NouvelleUtilisateur.email = mail;
            NouvelleUtilisateur.password = password;
            NouvelleUtilisateur.ActivationCode = randomUUID()
            const NouveauUtilisateur = await AppDataSource.getRepository(Utilisateur).save(NouvelleUtilisateur);
            await sendActivationMail(NouveauUtilisateur.ActivationCode,NouveauUtilisateur.email,NouveauUtilisateur.email)
            return NouveauUtilisateur
        }catch(err){
            return false
        }

    }

    static async UserWithMail(email){
        try{
            const UserMail = await AppDataSource.getRepository(Utilisateur).findOneBy({email:email})
            if(UserMail)
                return UserMail
            else
                return false
        }catch(err){
            return false
        }
        

    }

    static async connect(email,password){
        try {
            var UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).findOneBy({"email": email, "password": password})
    
            if(UtilisateurConnecte && UtilisateurConnecte.Activated){
                UtilisateurConnecte.uuid = randomUUID()
                UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).save(UtilisateurConnecte);
                return {toSend:JSON.stringify(UserController.DeleteSensitiveData(UtilisateurConnecte)),status:200}
    
            }else if(UtilisateurConnecte){
                UtilisateurConnecte.ActivationCode = randomUUID()
                let ActivationUser = await AppDataSource.getRepository(Utilisateur).save(UtilisateurConnecte);
                await sendActivationMail(ActivationUser.ActivationCode,ActivationUser.email,ActivationUser.email)
                return {toSend:erreur('Utilisateur non activé, vous venez de recevoir un mail de confirmation'),status:500}
            
            }else{
            
                return {toSend:erreur("L'utilisateur n'a pas été trouvée"),status:404}
            }
        } catch (err) {
            return {toSend:erreur("Une erreur est survenue"),status:404}
        }
    }

    static DeleteSensitiveData(user:Utilisateur){
        delete user.Activated
        delete user.ActivationCode
        delete user.password
        return user
    }

    static async DeconnectUser(token:string){
        try {
            var UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).findOneBy({"uuid": token})
    
            if(UtilisateurConnecte){
                UtilisateurConnecte.uuid = ""
                UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).save(UtilisateurConnecte);
                return true
            }else{
                return false
            }
        } catch (err) {
            return false
        }
    }


}