import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Directory } from "./Directory";
import { Utilisateur } from "./User";

@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    idActivity: number

    @Column()
    Action: string

    @Column()
    Route: string

    @Column()
    IP: string

    @Column({default:null})
    UserID: number



}
