import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { myEnv } from '../conf';
import { DbConnect } from './db';
import { bearerAuth } from 'hono/bearer-auth';
import jwt from 'jsonwebtoken';

import users from './routes/users';
import auth from './routes/auth';

const app = new Hono();
const port = myEnv.port;
await DbConnect();
console.log(`🚀 Server is running on http://localhost:${port}`);

app.get('/api', (c) => {
  return c.text('Hello Hono!');
});

app.use(
  '/api/users/*',
  bearerAuth({
    verifyToken: async (token, c) => {
      try {
        jwt.verify(token, myEnv.secretKey);
        return true;
      } catch {
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
