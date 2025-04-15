import { Router, Request, Response } from "express";
import { PembayaranController } from "../controllers/pembayaran.controller";
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const pembayaranController = new PembayaranController();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.getAll(req, res);
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.getById(req, res);
});

router.get("/transaksi/:transaksiId", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.getByTransaksiId(req, res);
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.create(req, res);
});

router.patch("/:id/status", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.updateStatus(req, res);
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    await pembayaranController.delete(req, res);
});

export default router; 