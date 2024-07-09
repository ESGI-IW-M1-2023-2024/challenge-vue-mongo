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
import comments from './routes/comments';

const app = new Hono();
const port = myEnv.port;
await DbConnect();
console.log(`🚀 Server is running on http://localhost:${port}`);

const securedPaths = ['users/*', 'likes/*', 'technologies/*', 'messages/*', 'comments/*'];
const routes = [users, technologies, auth, comments, like, message];

securedPaths.forEach((path) => {
  app.use(
    `/api/${path}`,
    bearerAuth({
      verifyToken: (token) => VerifyJWTToken(token),
    }),
  );
});

routes.forEach((currentRoute) => {
  app.route('/api', currentRoute);
});

app.use('*', async (c) => {
  c.json({ msg: '404 not found' });
});

serve({
  fetch: app.fetch,
  port,
});
