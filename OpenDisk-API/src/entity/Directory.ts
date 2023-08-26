import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
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

    @Column({nullable:true})
    SubDirectoryID: number

    @ManyToOne(() => Utilisateur, (user) => user.directory)
    ownerID: number

    @OneToMany(() => File, (file) => file.directory)
    files: File[]
    

}
