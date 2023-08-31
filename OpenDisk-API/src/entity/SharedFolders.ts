import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Directory } from "./Directory";
import { Utilisateur } from "./User";

@Entity()
export class SharedFolders{

    @PrimaryGeneratedColumn()
    idSharedFolders : number

    @ManyToMany(() => Utilisateur, user => user.sharedFolders,{cascade:true, onDelete:"CASCADE"})
    sharedUsers: Utilisateur[];
    


    @OneToOne(type=> Directory,{cascade:true, onDelete:"CASCADE"})
    @JoinColumn()
    directory: Directory


}