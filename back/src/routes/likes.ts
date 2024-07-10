import { Hono } from 'hono';
import { User } from '../models/user';
import { isValidObjectId } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const getUser = async (c: any) => {
  const idUser = c.req.param('idUser');
  if (!isValidObjectId(idUser)) {
    throw new Error("Invalid user id");
  }
  const user = await User.findById(idUser);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

api.get('/', roleMiddleware(Rose.user), async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }
  const likes = user.likes;
  return c.json(likes, 200);
});

api.get('/:id', roleMiddleware(Rose.user), async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const { id } = c.req.param();
  const like = user.likes.find((like: any) => like._id == id);
  if (!like) {
    return c.json({ message: 'Like not found' }, 404);
  }
  return c.json(like, 200);
});
export default api;
