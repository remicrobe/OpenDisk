import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Directory } from "./Directory";
import { Utilisateur } from "./User";

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    idFichier: number

    @Column()
    nomFichier: string

    @Column()
    nomFichierOriginal: string

    @ManyToOne(()=> Directory, (directory) => directory.files)
    directory: Directory
    
    @ManyToOne(() => Utilisateur, (user) => user.files)
    ownerID: number

}
