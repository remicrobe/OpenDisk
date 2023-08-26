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


class Index{ 
    static CONSTANT = null
    static app = express()
    static router = express.Router()
    
    static config(){ 
    
        Index.app.use('/profilpicture',express.static(path.resolve('src/profilepic')))
        Index.app.use(cors())
        Index.app.use(express.json())
        Index.app.use('/User', RouteUtilisateur)
        Index.app.use('/Files', FileRoute)
        Index.app.use('*', (req, res)=>{
           res.status(404).send("Vous vous êtes perdu ?")
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