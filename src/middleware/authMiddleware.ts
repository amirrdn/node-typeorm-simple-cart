import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database.config';
import { User } from '../models/user.model';
import { errorResponse } from '../utils/response.util';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json(errorResponse('Authentication required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as any;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.user_id } });

        if (!user) {
            return res.status(401).json(errorResponse('User not found'));
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Invalid token'));
    }
};
