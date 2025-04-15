import { Request, Response } from 'express';
import { AppDataSource } from '../config/database.config';
import { Transaksi, TransaksiStatus } from '../models/transaksi.model';
import { DetailTransaksi } from '../models/detail-transaksi.model';
import { Barang } from '../models/barang.model';
import { User } from '../models/user.model';
import { Like } from 'typeorm';
import { successResponse, errorResponse } from '../utils/response.util';

interface CustomRequest extends Request {
    session: {
        user?: {
            id: number;
        };
    }
}

interface RequestWithUser extends Request {
    user?: User;
}

export class TransaksiController {
    private transaksiRepository = AppDataSource.getRepository(Transaksi);
    private detailTransaksiRepository = AppDataSource.getRepository(DetailTransaksi);
    private barangRepository = AppDataSource.getRepository(Barang);

    private async generateInvoiceCode(): Promise<string> {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        
        const lastTransaction = await this.transaksiRepository.findOne({
            where: {
                kode_transaksi: Like(`INV/${dateStr}/%`)
            },
            order: {
                kode_transaksi: 'DESC'
            }
        });

        let sequence = 1;
        if (lastTransaction) {
            const lastSequence = parseInt(lastTransaction.kode_transaksi.split('/')[2]);
            sequence = lastSequence + 1;
        }

        return `INV/${dateStr}/${sequence.toString().padStart(4, '0')}`;
    }

    async create(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { 
                total_harga, 
                catatan, 
                detail_transaksi,
                user_id 
            } = req.body;

            const kodeTransaksi = await this.generateInvoiceCode();

            if (!detail_transaksi || !Array.isArray(detail_transaksi) || detail_transaksi.length === 0) {
                return res.status(400).json({ message: "Detail transaksi tidak valid" });
            }

            if (!user_id) {
                return res.status(400).json({ message: "User ID diperlukan" });
            }

            const transaksi = new Transaksi();
            transaksi.kode_transaksi = kodeTransaksi;
            transaksi.total_harga = total_harga;
            transaksi.user_id = user_id;
            transaksi.status = TransaksiStatus.PENDING;
            transaksi.catatan = catatan;
            
            const savedTransaksi = await queryRunner.manager.save(transaksi);

            for (const detail of detail_transaksi) {
                const { barang_id, jumlah, harga_satuan, subtotal } = detail;

                const barang = await queryRunner.manager.findOne(Barang, {
                    where: { id: barang_id }
                });

                if (!barang) {
                    await queryRunner.rollbackTransaction();
                    return res.status(404).json({ message: `Barang dengan ID ${barang_id} tidak ditemukan` });
                }

                if (!barang.stock || !jumlah || typeof barang.stock !== 'number' || typeof jumlah !== 'number') {
                    await queryRunner.rollbackTransaction();
                    return res.status(400).json({ message: "Data stok atau jumlah tidak valid" });
                }

                if (barang.stock < jumlah) {
                    await queryRunner.rollbackTransaction();
                    return res.status(400).json({ message: `Stok tidak mencukupi untuk barang ${barang.nama}` });
                }

                const newStock = barang.stock - jumlah;
                if (isNaN(newStock)) {
                    await queryRunner.rollbackTransaction();
                    return res.status(400).json({ message: "Perhitungan stok menghasilkan nilai tidak valid" });
                }

                barang.stock = newStock;
                await queryRunner.manager.save(barang);

                const detailTransaksi = new DetailTransaksi();
                detailTransaksi.transaksi_id = savedTransaksi.id;
                detailTransaksi.barang_id = barang.id;
                detailTransaksi.jumlah = jumlah;
                detailTransaksi.harga_satuan = harga_satuan;
                detailTransaksi.subtotal = subtotal;
                detailTransaksi.catatan = detail.catatan;

                await queryRunner.manager.save(detailTransaksi);
            }
            
            await queryRunner.commitTransaction();
            
            return res.status(201).json({
                message: "Transaksi berhasil dibuat",
                kode_transaksi: kodeTransaksi
            });

        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res.status(500).json({
                message: "Terjadi kesalahan saat membuat transaksi"
            });
        } finally {
            await queryRunner.release();
        }
    }

    async getAll(req: RequestWithUser, res: Response) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized: Silakan login terlebih dahulu"
                });
            }

            const transaksi = await this.transaksiRepository.find({
                where: { user_id: user.id },
                relations: [
                    'details',
                    'details.barang',
                    'pembayaran'
                ],
                order: {
                    created_at: 'DESC'
                }
            });

            return res.json({
                message: "Data transaksi berhasil diambil",
                data: transaksi
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data transaksi"
            });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const transaksi = await this.transaksiRepository.findOne({
                where: { id },
                relations: ['details', 'details.barang']
            });

            if (!transaksi) {
                return res.status(404).json({ message: "Transaksi tidak ditemukan" });
            }

            return res.json(transaksi);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Terjadi kesalahan saat mengambil detail transaksi"
            });
        }
    }

    async delete(req: CustomRequest, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const id = parseInt(req.params.id);
            const user_id = req.session?.user?.id;

            if (!user_id) {
                return res.status(401).json({
                    message: "Unauthorized: Silakan login terlebih dahulu"
                });
            }

            const transaksi = await queryRunner.manager.findOne(Transaksi, {
                where: { id, user_id },
                relations: ['details', 'details.barang']
            });

            if (!transaksi) {
                return res.status(404).json({ message: "Transaksi tidak ditemukan" });
            }

            for (const detail of transaksi.details) {
                const barang = detail.barang;
                barang.stock += detail.jumlah;
                await queryRunner.manager.save(barang);
            }

            await queryRunner.manager.delete(DetailTransaksi, {
                transaksi_id: id
            });

            await queryRunner.manager.delete(Transaksi, id);

            await queryRunner.commitTransaction();

            return res.json({
                message: "Transaksi berhasil dihapus"
            });

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            return res.status(500).json({
                message: "Terjadi kesalahan saat menghapus transaksi"
            });
        } finally {
            await queryRunner.release();
        }
    }
} 