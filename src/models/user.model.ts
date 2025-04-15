import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaksi } from "./transaksi.model";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    role_id!: number;

    @OneToMany(() => Transaksi, transaksi => transaksi.user)
    transaksi!: Transaksi[];
}
