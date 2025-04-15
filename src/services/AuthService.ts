import { AppDataSource } from '../config/database.config';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY as string;
if (!secretKey) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await userRepository.save(user);

    return user;
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ user_id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    return {
      token,
      user
    };
  }
}
