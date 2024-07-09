import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { myEnv } from '../conf';
import { DbConnect } from './db';
import { bearerAuth } from 'hono/bearer-auth';
import jwt from 'jsonwebtoken';

import users from './routes/users';
import auth from './routes/auth';
import { cors } from 'hono/cors'

const app = new Hono();
const port = myEnv.port;
await DbConnect();
console.log(`🚀 Server is running on http://localhost:${port}`);

app.use('/api/*', cors());


app.use(
  '/api/users/*',
  bearerAuth({
    verifyToken: (token) => {
      try {
        jwt.verify(token, myEnv.secretKey);
        return true;
      } catch (e: any) {
        console.log(e);
        return false;
      }
    },
  }),
);

app.route('/api', users);
app.route('/api', auth);

app.use('*', async (c) => {
  c.json({ msg: '404 not found' });
});

serve({
  fetch: app.fetch,
  port,
});
