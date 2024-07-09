import * as dotenv from 'dotenv';
dotenv.config();

interface Env {
  port: number;
  secretKey: string;
  mongoDb: {
    user: string;
    pwd: string;
    cluster: string;
    database: string;
  };
}

export const myEnv: Env = {
  port: Number(process.env.PORT) || 3000,
  secretKey: process.env.SECRET_KEY || '',
  mongoDb: {
    user: process.env.MONGODB_USER || '',
    pwd: process.env.MONGODB_PWD || '',
    cluster: process.env.MONGODB_CLUSTER || '',
    database: process.env.MONGODB_DATABASE || '',
  },
};
