import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user.model';
import { Barang } from '../models/barang.model';
import { Transaksi } from '../models/transaksi.model';
import { DetailTransaksi } from '../models/detail-transaksi.model';
import { Pembayaran } from '../models/pembayaran.model';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'shopdb',
  entities: [User, Barang, Transaksi, DetailTransaksi, Pembayaran],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});