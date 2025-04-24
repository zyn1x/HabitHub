import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
    }
  }
} 