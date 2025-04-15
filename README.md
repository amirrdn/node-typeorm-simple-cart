# Backend API Project

## Deskripsi
Proyek ini adalah backend API yang dibangun menggunakan Node.js dengan TypeScript. Menggunakan Express.js sebagai framework web dan TypeORM sebagai ORM untuk manajemen database.

## Teknologi yang Digunakan
- Node.js
- TypeScript
- Express.js
- TypeORM
- MySQL/PostgreSQL
- JWT untuk autentikasi
- Bcrypt untuk enkripsi password
- Multer untuk upload file
- CORS untuk cross-origin resource sharing

## Prasyarat
Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
- Node.js (versi terbaru)
- MySQL atau PostgreSQL
- npm atau yarn

## Instalasi
1. Clone repositori ini
2. Install dependencies:
```bash
npm install
```
3. Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret
```

## Menjalankan Aplikasi
Untuk menjalankan aplikasi dalam mode development:
```bash
npm run dev
```

## Scripts yang Tersedia
- `npm run dev` - Menjalankan aplikasi dalam mode development
- `npm run typeorm` - Menjalankan TypeORM CLI

## Struktur Proyek

## Fitur
- Sistem Autentikasi dengan JWT
- Upload File menggunakan Multer
- Database ORM menggunakan TypeORM
- API RESTful
- Password Hashing
- CORS enabled

## Pengembangan
Proyek ini menggunakan TypeScript untuk type safety dan pengembangan yang lebih baik. Pastikan untuk mengikuti standar penulisan kode yang ada dan menambahkan type definitions yang sesuai.

## Lisensi
ISC
