import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
