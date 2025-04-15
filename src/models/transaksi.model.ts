import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { DetailTransaksi } from "./detail-transaksi.model";
import { Pembayaran } from "./pembayaran.model";

export enum TransaksiStatus {
    PENDING = "pending",
    DIBAYAR = "dibayar",
    DIPROSES = "diproses",
    DIKIRIM = "dikirim",
    SELESAI = "selesai",
    DIBATALKAN = "dibatalkan"
}

@Entity()
export class Transaksi {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    kode_transaksi!: string;

    @ManyToOne(() => User, user => user.transaksi)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column()
    user_id!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_harga!: number;

    @Column({
        type: 'enum',
        enum: TransaksiStatus,
        default: TransaksiStatus.PENDING
    })
    status!: TransaksiStatus;

    @Column({ type: 'text', nullable: true })
    catatan!: string;

    @OneToMany(() => DetailTransaksi, detail => detail.transaksi)
    details!: DetailTransaksi[];

    @OneToMany(() => Pembayaran, pembayaran => pembayaran.transaksi)
    pembayaran!: Pembayaran[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 