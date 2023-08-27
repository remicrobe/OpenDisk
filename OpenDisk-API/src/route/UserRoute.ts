import {Router} from "express";

import { createHash, randomUUID } from 'crypto';





import { Utilisateur } from "../entity/User";
import { AppDataSource } from "../data-source";
import { erreur } from "../utils/Utils";

import { sendActivationMail } from "../mail-tools";
import { UserController } from "../controller/UserController";

import { ValidEmail, ValidPassword } from "../utils/Utils";

const RouteUtilisateur = Router();


/*RouteUtilisateur.get('/', async (req,res) =>{
    const utilisateur = await AppDataSource.getRepository(Utilisateur).find()
    res.status(200).send({"utilisateur": utilisateur.length})
})*/

RouteUtilisateur.post('/NouveauUtilisateur', async (req,res ) => {
    const email:string = req.body.email;
    const password:string = createHash('sha256').update(req.body.mdp).digest('hex');
    if(ValidEmail(email) && ValidPassword(password)){
        const VerifMail = await UserController.UserWithMail(email)
        if(VerifMail){
            res.status(500).send(erreur("Un utilisateur existe déja avec ce mail"))
        }else{
            let NouveauUtilisateur = await UserController.CreateUser(email,password)
            if(NouveauUtilisateur)
                res.status(200).send({sucess:"Vous venez de recevoir un mail de confirmation sur : " + email });
            else
                res.status(500).send(erreur("L'utilisateur n'a pas été créé"))

        }
    }else{
        res.status(500).send(erreur("Données invalide"))
    }
})

RouteUtilisateur.post('/LienDeRecuperation', async (req,res)=>{
    const email:string = req.body.email;
    if(ValidEmail(email)){
        const VerifMail = await UserController.UserWithMail(email)
        if(!VerifMail){
            res.status(404).send(erreur("Utilisateur non trouvé"))
        }else{
            let RecoveryMail = await UserController.SendRecoveryMail(VerifMail)
            if(RecoveryMail)
                res.status(200).send({sucess:"Vous venez de recevoir un mail de récupération sur : " + email });
            else
                res.status(500).send(erreur('Une erreur est survenue'))
        }
    }else{
        res.status(500).send(erreur("Données invalide"))
    }


})

RouteUtilisateur.post('/EditPassword', async (req,res)=>{
    const RecoveryCode:string = req.body.RecoveryCode;
    const NewPassword:string = createHash('sha256').update(req.body.password).digest('hex');
    let ResultData = await UserController.SetNewPassword(RecoveryCode,NewPassword)
    res.status(ResultData.status).send(ResultData.toSend)
})



/*RouteUtilisateur.post('/connecter', async (req, res) => {
    const email:string = req.body.email;
    const password:string = createHash('sha256').update(req.body.mdp).digest('hex');

    var UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).findOneBy({"email": email, "password": password})

    if(UtilisateurConnecte && UtilisateurConnecte.Activated){
        UtilisateurConnecte.uuid = randomUUID()
        UtilisateurConnecte = await AppDataSource.getRepository(Utilisateur).save(UtilisateurConnecte);
        
        res.status(200).send(JSON.stringify(UserController.DeleteSensitiveData(UtilisateurConnecte)))
    }else if(UtilisateurConnecte){
        UtilisateurConnecte.ActivationCode = randomUUID()
        let ActivationUser = await AppDataSource.getRepository(Utilisateur).save(UtilisateurConnecte);
        await sendActivationMail(ActivationUser.ActivationCode,ActivationUser.email,ActivationUser.email)
        res.status(500).send(erreur('Utilisateur non activé, vous venez de recevoir un mail de confirmation'))
    
    }else{
        res.status(404).send(erreur("L'utilisateur n'a pas été trouvée"))
    }
})*/ // OLD VERSION

RouteUtilisateur.post('/connecter', async (req, res) => {
    const email:string = req.body.email;
    const password:string = createHash('sha256').update(req.body.mdp).digest('hex');
    var ResultData = await UserController.connect(email,password)
    res.status(ResultData.status).send(ResultData.toSend)
})

RouteUtilisateur.post('/deconnecter', async (req, res) => {
    const token:string = req.body.token;
    var UtilisateurConnecte = await UserController.DeconnectUser(token)
    if(UtilisateurConnecte){
        res.status(200).send("Déconnecté !")
    }else{
        res.status(404).send(erreur("L'utilisateur n'a pas été trouvée"))
    }
})

RouteUtilisateur.post('/ActivateAccount', async (req, res) => {
    if(req.body.ActivationCode){
        let UserActivee = await UserController.ActivateAccount(req.body.ActivationCode)
        if(UserActivee){
            res.status(200).send("Utilisateur activé")
        }else{
            res.status(404).send("Token invalide")
        }
    }else
        res.send(500).send(erreur("Requete invalide"))

})

RouteUtilisateur.post('/quisuisje', async (req, res) => {
    const token:string = req.body.token;

    var UtilisateurConnecte = await UserController.GetUserFromToken(token)
    if(UtilisateurConnecte){
        res.status(200).send({Utilisateur: JSON.stringify(UserController.DeleteSensitiveData(UtilisateurConnecte))})
    }else{
        res.status(404).send(erreur("L'utilisateur n'a pas été trouvée"))
    }
})

export {RouteUtilisateur};