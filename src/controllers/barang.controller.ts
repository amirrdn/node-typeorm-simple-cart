import { Request, Response } from 'express';
import { AppDataSource } from '../config/database.config';
import { Barang } from '../models/barang.model';
import multer from 'multer';

interface MulterRequest extends Request {
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    const namaBarang = req.body.nama ? req.body.nama.replace(/\s+/g, '-').toLowerCase() : 'barang';
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    cb(null, `${namaBarang}-${timestamp}.${extension}`);
  }
});

const upload = multer({ storage: storage });

export class BarangController {
    private barangRepository = AppDataSource.getRepository(Barang);

    async getAllBarang(req: Request, res: Response): Promise<void> {
        try {
            const barang = await this.barangRepository.find();
            res.json(barang);
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan saat mengambil data barang" });
        }
    }

    async getBarangById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const barang = await this.barangRepository.findOne({ where: { id } });
            
            if (!barang) {
                res.status(404).json({ message: "Barang tidak ditemukan" });
                return;
            }
            
            res.json(barang);
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan saat mengambil data barang" });
        }
    }

    async createBarang(req: MulterRequest, res: Response): Promise<void> {
        try {
            const { nama, harga, stock } = req.body;
            let gambar = '';
            
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const file = req.files[0];
                gambar = file.filename;
            }
            
            const barang = this.barangRepository.create({
                nama,
                harga,
                stock,
                gambar
            });
            
            await this.barangRepository.save(barang);
            res.status(201).json(barang);
        } catch (error) {
            console.error('Error creating barang:', error);
            res.status(500).json({ message: "Terjadi kesalahan saat membuat barang" });
        }
    }

    async updateBarang(req: MulterRequest, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { nama, harga, stock } = req.body;
            
            let barang = await this.barangRepository.findOne({ where: { id } });
            
            if (!barang) {
                res.status(404).json({ message: "Barang tidak ditemukan" });
                return;
            }
            
            barang.nama = nama;
            barang.harga = harga;
            barang.stock = stock;
            
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const file = req.files[0];
                barang.gambar = file.filename;
            }
            
            await this.barangRepository.save(barang);
            res.json(barang);
        } catch (error) {
            console.error('Error updating barang:', error);
            res.status(500).json({ message: "Terjadi kesalahan saat mengupdate barang" });
        }
    }

    async deleteBarang(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const barang = await this.barangRepository.findOne({ where: { id } });
            
            if (!barang) {
                res.status(404).json({ message: "Barang tidak ditemukan" });
                return;
            }
            
            await this.barangRepository.remove(barang);
            res.json({ message: "Barang berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan saat menghapus barang" });
        }
    }
}