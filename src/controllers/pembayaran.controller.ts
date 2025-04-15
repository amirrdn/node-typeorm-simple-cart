import { Request, Response } from "express";
import { AppDataSource } from "../config/database.config";
import { Pembayaran, MetodePembayaran, StatusPembayaran } from "../models/pembayaran.model";
import { Transaksi, TransaksiStatus } from "../models/transaksi.model";
import { successResponse, errorResponse } from '../utils/response.util';

export class PembayaranController {
    private pembayaranRepository = AppDataSource.getRepository(Pembayaran);
    private transaksiRepository = AppDataSource.getRepository(Transaksi);

    async getAll(req: Request, res: Response) {
        try {
            const pembayaran = await this.pembayaranRepository.find({
                relations: ["transaksi"]
            });
            return res.json(successResponse("Data pembayaran berhasil diambil", pembayaran));
        } catch (error) {
            return res.status(500).json(errorResponse("Terjadi kesalahan saat mengambil data pembayaran"));
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const pembayaran = await this.pembayaranRepository.findOne({
                where: { id },
                relations: ["transaksi"]
            });

            if (!pembayaran) {
                return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
            }

            return res.json(pembayaran);
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pembayaran" });
        }
    }

    async getByTransaksiId(req: Request, res: Response) {
        try {
            const transaksiId = parseInt(req.params.transaksiId);
            const pembayaran = await this.pembayaranRepository.find({
                where: { transaksi_id: transaksiId },
                relations: ["transaksi"]
            });

            return res.json(pembayaran);
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pembayaran" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { transaksi_id, jumlah_pembayaran, metode_pembayaran, catatan } = req.body;

            const pembayaran = this.pembayaranRepository.create({
                transaksi_id,
                jumlah_pembayaran,
                metode_pembayaran,
                catatan,
                status_pembayaran: StatusPembayaran.PENDING
            });

            await this.pembayaranRepository.save(pembayaran);
            return res.status(201).json(successResponse("Pembayaran berhasil dibuat", pembayaran));
        } catch (error) {
            return res.status(500).json(errorResponse("Terjadi kesalahan saat membuat pembayaran"));
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { status_pembayaran } = req.body;

            if (!Object.values(StatusPembayaran).includes(status_pembayaran)) {
                return res.status(400).json({ message: "Status pembayaran tidak valid" });
            }

            const pembayaran = await this.pembayaranRepository.findOne({
                where: { id },
                relations: ["transaksi"]
            });

            if (!pembayaran) {
                return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
            }

            pembayaran.status_pembayaran = status_pembayaran;

            if (status_pembayaran === StatusPembayaran.SUCCESS) {
                const transaksi = pembayaran.transaksi;
                transaksi.status = TransaksiStatus.DIBAYAR;
                await this.transaksiRepository.save(transaksi);
            }

            await this.pembayaranRepository.save(pembayaran);

            return res.json(pembayaran);
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengupdate status pembayaran" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const pembayaran = await this.pembayaranRepository.findOne({
                where: { id }
            });

            if (!pembayaran) {
                return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
            }

            await this.pembayaranRepository.remove(pembayaran);

            return res.json({ message: "Pembayaran berhasil dihapus" });
        } catch (error) {
            return res.status(500).json({ message: "Terjadi kesalahan saat menghapus pembayaran" });
        }
    }
} 