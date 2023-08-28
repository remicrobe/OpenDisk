import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Directory } from "./Directory";
import { File } from "./File";


@Entity()
export class SharedLink{
    @PrimaryGeneratedColumn()
    idLink: number

    @Column()
    token: string

    @OneToOne(type=> File)
    @JoinColumn()
    file: File
}