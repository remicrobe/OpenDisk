import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { File } from "./File";
import { Utilisateur } from "./User";

@Entity()
export class Directory {

    @PrimaryGeneratedColumn()
    idDirectory: number

    @Column()
    DirectoryName: string

    @Column({default:false})
    MainDirectory: boolean

    @Column({default:false})
    shared: boolean

    @Column({nullable:true})
    SubDirectoryID: number

    @ManyToOne(type => Utilisateur, (user) => user.directory)
    ownerID: Utilisateur

    @OneToMany(() => File, (file) => file.directory)
    files: File[]
    

}
