import { FileController } from "../controller/FileController";

import {Router} from 'express';
import { AppDataSource } from "../data-source";
import { File } from "../entity/File";
import * as path from "path"
import { UserController } from "../controller/UserController";
import { erreur, sucess } from "../utils/Utils";
import { stringify } from "qs";
import { Utilisateur } from "../entity/User";

import * as fs from 'fs'
import { Directory } from "../entity/Directory";
import { DirectoryController } from "../controller/DirectoryController";
const FileRoute = Router()


FileRoute.post('/UploadFile', (req,res) => {

    
        FileController.upload.single('file')(req,res, async (err)=>{
            if(err){
                res.status(500).send("Une erreur est survenue " +err)
            }else{
                const userID = await UserController.GetUseriDFromToken(req.body.token)
                if(userID){

                    const myNewFile = new File
                    myNewFile.nomFichierOriginal = req.file.originalname
                    myNewFile.nomFichier = req.file.filename
                    myNewFile.ownerID = userID
                    myNewFile.directory = req.body.directoryid
                    
                    await AppDataSource.getRepository(File).save(myNewFile);
                    
                    res.send("Fichier envoyé avec succés")
                }else{
                    res.status(500).send("Une erreur est survenue")
                }
            }
        })        
    
    
})

FileRoute.post('/UploadProfilPic', async (req,res) => {

    
    FileController.uploaddp.single('file')(req,res, async (err)=>{
        if(err){
            res.status(500).send("Une erreur est survenue lors de l'envoi " + err)
        }else{
            const userID = await UserController.GetUserFromToken(req.body.token)
            if(userID && req.file){
                if(userID.profilepic !== "default.jpg"){
                    fs.unlink(path.resolve('src/profilepic/' + userID.profilepic), (err)=> console.log(err))
                } 
   
                userID.profilepic = req.file.filename
                console.log(req.file)
                await AppDataSource.getRepository(Utilisateur).save(userID)
                res.status(200).send("Fichier envoyé avec succés")  
            }else{
                res.status(500).send("Une erreur est survenue")
            }
        }
    })        


})


FileRoute.post('/NewDirectory', async (req,res) => {

    if(req.body.token && req.body.FolderName){
        let userid = await UserController.GetUseriDFromToken(req.body.token)
        if(!userid){
            res.status(500).send(erreur("Token invalide"))
        }else{
            let myDirectory = new Directory
            myDirectory.DirectoryName = req.body.FolderName
            myDirectory.ownerID = userid

            if(req.body.subdirectoryID)
                if(!isNaN(parseInt(req.body.subdirectoryID )))
                    myDirectory.SubDirectoryID = req.body.subdirectoryID 
            

            AppDataSource.getRepository(Directory).save(myDirectory)
            res.send("Dossier créé !")
        }
    }else{
        res.status(500).send(erreur("Veuillez respecter les parametres"))
    }
    

})



FileRoute.get('/GetFile', async (req,res) => {
            const MesFichiers = await FileController.getFile()
            if(MesFichiers.length)
                res.status(200).send(MesFichiers.length.toString())
            else{
                res.status(200).send("Il n'y a pas de fichier")
            }
 })

 FileRoute.get('/GetFile/:id/:filename', async (req,res) => {
    if(req.params.filename && req.headers.token && req.params.id){
        const isFileToUser = await FileController.isFileToUser(req.params.id, req.headers.token)
        if(isFileToUser){
            const FileToSearch = new File
            const vraiNom = await AppDataSource.getRepository(File).findOneBy({nomFichierOriginal: req.params.filename})
            if(vraiNom)
                res.sendFile(path.resolve('src/uploads/' + vraiNom.nomFichier));
            else
                res.status(404).send("Fichier non trouvé")
        }else{
            res.send(erreur("Fichier non autorisé..."))
        }
    }else{
        res.status(404).send("Il manque un paramètre")
        console.log(req.headers)
    }
})

FileRoute.get('/GetContentInDirectory/:iddirectory/', async (req,res) => {
 
    if(req.params.iddirectory && req.headers.token){
        const FilesInDirectory = await FileController.FilesInDirectory(req.params.iddirectory,req.headers.token)
        const FolderInFolder = await FileController.FolderInFolder(req.params.iddirectory, req.headers.token)

        if(!FilesInDirectory || !FolderInFolder)
            res.status(500).send("Erreur")
        else 
            res.send({files:FilesInDirectory,folder:FolderInFolder})
    }else{
        res.status(500).send("Erreur")
    }
})

FileRoute.post('/RenameFile', async (req,res) =>{
    const usertoken:string = req.body.token
    const idfile:number = req.body.idfile
    const newname:string = req.body.newname

    if(usertoken && idfile && newname){
        const Result = await FileController.RenameFile(idfile, usertoken, newname)
        if(Result)
            res.status(200).send(sucess('Votre fichier a bien été renommé'))
        else
            res.status(500).send(erreur('Une erreur est survenue'))
    }else{
        res.status(500).send(erreur('Votre requete semble incorrecte'))
    }



})

FileRoute.post('/RenameFolder', async (req,res) =>{
    const usertoken:string = req.body.token
    const idfolder:number = req.body.idFolder
    const newname:string = req.body.newname

    if(usertoken && idfolder && newname){
        const Result = await DirectoryController.RenameFolder(idfolder, usertoken, newname)
        if(Result)
            res.status(200).send(sucess('Votre dossier a bien été renommé'))
        else
            res.status(500).send(erreur('Une erreur est survenue'))
    }else{
        res.status(500).send(erreur('Votre requete semble incorrecte'))
    }



})


FileRoute.get('/GetDirectory/', async (req,res) => {

    if(req.headers.token){
        const Folders = await FileController.GetFolders(req.headers.token)

        if(!Folders)
            res.status(500).send("Erreur")
        else 
            res.send({files:[],folder:Folders})
        }else{
            res.status(500).send("Erreur")
        }
})

FileRoute.post('/RemoveDirectory/', async (req,res) => {
    if(req.body.token && req.body.directoryId){
        let userid = await UserController.GetUseriDFromToken(req.body.token)
        if(!userid){
            res.status(500).send(erreur("Token invalide"))
        }else{
           
            if(await DirectoryController.deleteDirectory(req.body.directoryId, req.body.token)){
                res.status(200).send("ok")
            }else{
                res.status(500).send(erreur("Une erreur est survenue"))
            }


        }
    }else{
        res.status(500).send(erreur("Veuillez respecter les parametres"))
    }
})



FileRoute.route('/').get((req,res) =>{
            res.send("Vous êtes sur la route fichier ")
})

export {FileRoute};
    
