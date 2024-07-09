import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { myEnv } from '../conf';
import { DbConnect } from './db';
import { bearerAuth } from 'hono/bearer-auth';
import VerifyJWTToken from './utils/verify-token';

import users from './routes/users';
import technologies from './routes/technologies';
import auth from './routes/auth';
import like from './routes/likes';
import message from './routes/messages';

const app = new Hono();
const port = myEnv.port;
await DbConnect();
console.log(`🚀 Server is running on http://localhost:${port}`);

app.use(
  '/api/users/*',
  bearerAuth({
    verifyToken: (token) => VerifyJWTToken(token),
  }),
);

app.use(
  '/api/likes/*',
  bearerAuth({
    verifyToken: (token) => VerifyJWTToken(token),
  }),
);

app.use(
  '/api/technologies/*',
  bearerAuth({
    verifyToken: (token) => VerifyJWTToken(token),
  }),
);

app.use(
  '/api/messages/*',
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
app.route('/api', technologies);
app.route('/api', auth);
app.route('/api', like);
app.route('/api', message);

app.use('*', async (c) => {
  c.json({ msg: '404 not found' });
});

serve({
  fetch: app.fetch,
  port,
});
