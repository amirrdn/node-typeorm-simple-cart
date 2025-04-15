import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Transaksi } from "./transaksi.model";
import { Barang } from "./barang.model";

@Entity()
export class DetailTransaksi {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Transaksi, transaksi => transaksi.details)
    @JoinColumn({ name: 'transaksi_id' })
    transaksi!: Transaksi;

    @Column()
    transaksi_id!: number;

    @ManyToOne(() => Barang)
    @JoinColumn({ name: 'barang_id' })
    barang!: Barang;

    @Column()
    barang_id!: number;

    @Column()
    jumlah!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    harga_satuan!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal!: number;

    @Column()
    catatan!: string;
} 