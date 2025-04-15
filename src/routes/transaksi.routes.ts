import { Router, Request, Response } from "express";
import { TransaksiController } from "../controllers/transaksi.controller";
import { authMiddleware } from '../middlewares/authMiddleware';

declare global {
    namespace Express {
        interface Request {
            session: {
                user?: {
                    id: number;
                };
            };
        }
    }
}

const router = Router();
const transaksiController = new TransaksiController();

router.get("/", authMiddleware, (req: Request, res: Response) => {
    transaksiController.getAll(req, res);
});

router.get("/:id", authMiddleware, (req: Request, res: Response) => {
    transaksiController.getById(req, res);
});

router.post("/", authMiddleware, (req: Request, res: Response) => {
    transaksiController.create(req, res);
});

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
    transaksiController.delete(req, res);
});

export default router; 
