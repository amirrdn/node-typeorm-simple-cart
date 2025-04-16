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
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number;
        };
    }
}

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(session({
    secret: process.env.JWT_SECRET_KEY || 'KJKGSGAFD871652',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  app.use('/uploads', (req, res, next) => {
    next();
  }, express.static(path.join(process.cwd(), 'public/uploads')));

  app.use((req, res, next) => {
    next();
  });

  app.use('/auth', authRoutes);
  app.use('/barang', barangRoutes);
  app.use('/transaksi', transaksiRoutes);
  app.use('/pembayaran', pembayaranRoutes);

  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
  });
});
