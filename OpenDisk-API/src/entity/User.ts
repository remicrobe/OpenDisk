import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import { Directory } from "./Directory";
import { File } from "./File";


export enum RoleUtilisateur {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity({ name: "utilisateur" })
export class Utilisateur {
    @PrimaryGeneratedColumn("increment")
    idUtilisateur: number;

    @Column({ type: "text" }) // Spécifie que nomNote est de type texte en MySQL
    email: string;

    @Column({ type: "text" }) // Spécifie que contenuNote est de type texte en MySQL
    password: string;

    @Column({ type: "text", nullable: true }) // Spécifie que contenuNote est de type texte en MySQL
    uuid: string; 

    @Column({ type: "text" }) 
    ActivationCode: string;

    @Column({ type: "text" }) 
    RecoveryCode: string;

    @Column({default:false})
    Activated: boolean;

    @Column({type : "enum", enum: RoleUtilisateur, default: RoleUtilisateur.USER})
    grade: RoleUtilisateur;

    @CreateDateColumn()
    dateCreation: Date;

    @OneToMany(() => Directory, (directory) => directory.ownerID)
    directory: Directory[]

    @OneToMany(() => File, (file) => file.ownerID)
    files: File[]

    @Column({default: "default.jpg"})
    profilepic: string
}
 