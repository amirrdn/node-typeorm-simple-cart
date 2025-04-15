import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Transaksi } from "./transaksi.model";

export enum MetodePembayaran {
    TUNAI = "TUNAI",
    TRANSFER = "TRANSFER",
    KARTU_KREDIT = "KARTU_KREDIT",
    KARTU_DEBIT = "KARTU_DEBIT",
    E_WALLET = "E_WALLET"
}

export enum StatusPembayaran {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

@Entity("pembayaran")
export class Pembayaran {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Transaksi, transaksi => transaksi.pembayaran)
    @JoinColumn({ name: "transaksi_id" })
    transaksi!: Transaksi;

    @Column()
    transaksi_id!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    jumlah_pembayaran!: number;

    @Column({
        type: "enum",
        enum: MetodePembayaran,
        default: MetodePembayaran.TUNAI,
        name: 'metode_pembayaran'
    })
    metode_pembayaran!: MetodePembayaran;

    @Column({
        type: "enum",
        enum: StatusPembayaran,
        default: StatusPembayaran.PENDING
    })
    status_pembayaran!: StatusPembayaran;


    @Column({ type: "text", nullable: true })
    catatan?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 