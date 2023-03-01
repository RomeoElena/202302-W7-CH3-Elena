import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

export type PayloadToken = {
  email: string;
  role: string;
};

const salt = 10;

export class Auth {
  static createJWT(payload: PayloadToken) {
    const result = jwt.sign(payload, config.jwtSecret as string);
    return result;
  }

  static verfyJWT(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string') throw new Error('Invalid payload');
    return result;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
