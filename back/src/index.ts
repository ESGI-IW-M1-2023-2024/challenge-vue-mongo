import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { myEnv } from '../conf';
import { DbConnect } from './db';

import users from './routes/users';
import technologies from './routes/technologies';
import auth from './routes/auth';
import { cors } from 'hono/cors';
import like from './routes/likes';
import message from './routes/messages';
import comments from './routes/comments';
import issues from './routes/issues';
import { WebSocketServer } from 'ws';

const app = new Hono();
const port = myEnv.port;
await DbConnect();
console.log(`🚀 Server is running on http://localhost:${port}`);

app.use('/api/*', cors());
app.use('*', async (c, next) => {
  await next();
  console.info(`[${c.req.method}] ${c.req.path} - ${c.res.status}`);
});

const routes = [users, technologies, auth, comments, like, message, issues];

routes.forEach((currentRoute) => {
  app.route('/api', currentRoute);
});

app.use('*', async (c) => {
  c.json({ msg: '404 not found' });
});

const server = serve({
  fetch: app.fetch,
  port,
});

// @ts-ignore
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', async function message(data) {
    console.log(data);
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  });
});
