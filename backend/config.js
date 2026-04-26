import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const mongoDBURL = process.env.MONGODB_URL || 'mongodb+srv://vedantanand01:rAdShKtMQr4t7dMN@cluster0.bsmmwsc.mongodb.net/?appName=Cluster0';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';