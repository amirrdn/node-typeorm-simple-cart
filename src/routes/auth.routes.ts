import express, { RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', AuthController.register as RequestHandler);
router.post('/login', AuthController.login as RequestHandler);
router.post('/refresh-token', AuthController.refreshToken as RequestHandler);

export default router;
