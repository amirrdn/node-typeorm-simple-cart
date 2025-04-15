import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
      const user = await AuthService.register(name, email, password);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const data = await AuthService.login(email, password);
      res.status(200).json({ message: 'Login successful', data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
