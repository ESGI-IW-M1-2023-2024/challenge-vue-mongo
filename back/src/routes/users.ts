import { Hono } from 'hono';
import { User } from '../models/user';

const api = new Hono().basePath('/users');

api.get('/', async (c) => {
  const users = await User.find();
  return c.json(users, 200);
});

export default api;
