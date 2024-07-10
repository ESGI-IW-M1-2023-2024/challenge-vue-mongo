import { Hono } from 'hono';
import { Like } from '../models/like';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const api = new Hono().basePath('/likes');

api.get('/', roleMiddleware(Role.USER), async (c) => {
  const users = await Like.find();
  return c.json(users, 200);
});

api.get('/:id', roleMiddleware(Role.ADMIN), async (c) => {
  const { id } = c.req.param();
  const like = await Like.findById(id);
  if (!like) {
    return c.json({ message: 'Like not found' }, 404);
  }
  return c.json(like, 200);
});

api.post('/', roleMiddleware(Role.USER), async (c) => {
  const { idUser, score } = await c.req.json();
  try {
    const like = new Like({ idUser, score });
    await like.save();
    return c.json(like, 201);
  } catch (err: any) {
    return c.json({ message: 'Error creating like', error: err.message }, 400);
  }
});

api.patch('/:id', roleMiddleware(Role.USER), async (c) => {
  const { id } = c.req.param();
  const { score } = await c.req.json();
  try {
    const like = await Like.findByIdAndUpdate(
      id,
      {
        score,
      },
      { new: true },
    );
    return c.json(like, 200);
  } catch (err: any) {
    return c.json({ message: 'Error updating like', error: err.message }, 400);
  }
});

api.delete('/:id', roleMiddleware(Role.USER), async (c) => {
  const { id } = c.req.param();
  try {
    await Like.findByIdAndDelete(id);
    return c.json({ message: 'Like deleted successfully' }, 200);
  } catch (err: any) {
    return c.json({ message: 'Error deleting like', error: err.message }, 400);
  }
});

export default api;
