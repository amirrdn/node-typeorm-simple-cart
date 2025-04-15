import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Barang {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nama!: string;

    @Column()
    harga!: number;

    @Column({ default: 0 })
    stock!: number;

    @Column({ nullable: true })
    gambar!: string;
}
