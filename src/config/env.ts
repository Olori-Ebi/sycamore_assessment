import dotenv from 'dotenv';

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    POSTGRES_HOST: process.env.POSTGRES_HOST!,
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT || 55432),
    POSTGRES_DB: process.env.POSTGRES_DB!,
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    PORT: Number(process.env.PORT) || 5000,
};
