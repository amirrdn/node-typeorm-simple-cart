import express from 'express';
import { BarangController } from '../controllers/barang.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import multer from 'multer';

const router = express.Router();
const barangController = new BarangController();

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

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', authMiddleware, (req, res) => {
    barangController.getAllBarang(req, res);
});

router.get('/:id', authMiddleware, (req, res) => {
    barangController.getBarangById(req, res);
});

router.post('/', authMiddleware, upload.any(), (req, res) => {
    barangController.createBarang(req, res);
});

router.put('/:id', authMiddleware, upload.any(), (req, res) => {
    barangController.updateBarang(req, res);
});

router.delete('/:id', authMiddleware, (req, res) => {
    barangController.deleteBarang(req, res);
});

export default router;
