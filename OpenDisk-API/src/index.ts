import * as dotenv from 'dotenv';
dotenv.config()

import { AppDataSource } from "./data-source"
import * as express from 'express'
import {Request, Response} from 'express'
import * as cors from 'cors'
import { FileRoute } from "./route/FileRoute";
import { RouteUtilisateur } from "./route/UserRoute"
import * as path from 'path'

import config from './loadconfig'
import { Activity } from './entity/Activity';
import { UserController } from './controller/UserController';
import { erreur } from './utils/Utils';
import { sendMailError } from './mail-tools';


class Index{ 
    static CONSTANT = null
    static app = express()
    static router = express.Router()
    
    static config(){ 


        Index.app.use(cors())
        Index.app.use(express.json())
        Index.app.use(async (req,res,next)=>{

            const activity = new Activity()
            
             activity.IP = req.ip; // Récupère l'adresse IP
             activity.Action = req.method
             activity.Route = req.originalUrl;
             if(req.body.token){
                let UserID = await UserController.GetUseriDFromToken(req.body.token)
                if(UserID) activity.UserID = UserID
             }else if(req.headers.token){
                let UserID = await UserController.GetUseriDFromToken(req.headers.token)
                if(UserID) activity.UserID = UserID
             }
             
             req.body.activity = await AppDataSource.getRepository(Activity).save(activity)

            next();
            
        })
        Index.app.use('/profilpicture',express.static(path.resolve('src/profilepic')))
        Index.app.use('/User', RouteUtilisateur)
        Index.app.use('/Files', FileRoute)
        Index.app.use('*', (req, res)=>{
           res.status(404).send("Vous vous êtes perdu ?")
       }) 
    
       Index.app.use((err,req,res,next)=>{
            res.status(500).send(erreur('Une erreur est survenue'));
            sendMailError(err.stack,req.body.activity.idActivity)
       })
         
    } 
 
    static configServer(){
        AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données")
            Index.app.listen(config.PORT, ()=> console.log("API démarrée ...."))
            
            
         
        }).catch(error => console.log(error))
    }

    static main(){
        Index.config()
        Index.configServer()
    }

}

Index.main() 