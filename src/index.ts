import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database.config';
import barangRoutes from './routes/barang.routes';
import authRoutes from './routes/auth.routes';
import transaksiRoutes from './routes/transaksi.routes';
import pembayaranRoutes from './routes/pembayaran.routes';
import path from 'path';

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/uploads', (req, res, next) => {
    console.log('Request path:', req.path);
    console.log('Full URL:', req.url);
    next();
  }, express.static(path.join(process.cwd(), 'public/uploads')));

  app.use('/auth', authRoutes);
  app.use('/barang', barangRoutes);
  app.use('/transaksi', transaksiRoutes);
  app.use('/pembayaran', pembayaranRoutes);

  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
  });
});
