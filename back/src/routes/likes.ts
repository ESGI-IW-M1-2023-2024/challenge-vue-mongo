import { Hono } from 'hono';
import { User } from '../models/user';
import { isValidObjectId } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';
import { ILike, Like } from '../models/like';

const api = new Hono().basePath('/users/:idUser/likes');

const getUser = async (c: any) => {
  const idUser = c.req.param('idUser');
  if (!isValidObjectId(idUser)) {
    throw new Error('Invalid user id');
  }
  const user = await User.findById(idUser);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

api.get('/', roleMiddleware(Role.USER), async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }
  const likes = user.likes;
  return c.json(likes, 200);
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
  const user = await getUser(c);
  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const id = c.req.param('idUser');
  const like = user.likes.find((like: ILike) => like._id.toString() == id.toString());
  if (!like) {
    return c.json({ message: 'Like not found' }, 404);
  }
  return c.json(like, 200);
});

api.post('/', roleMiddleware(Role.USER), async (c) => {
  const loggedUser = c.get('user');
  const idUser = c.req.param('idUser');
  const body = await c.req.json();

  if (idUser === loggedUser._id.toString()) {
    return c.json({ message: 'You cannot like yourself' }, 400);
  }

  const user = await User.findById(idUser);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  try {
    const newLike = new Like({ idUser, score: body.score });
    const saveLike = await newLike.save();
    user.likes.push(saveLike);
    await user.save();
    return c.json(saveLike, 201);
  } catch (error: any) {
    return c.json(error._message, 400);
  }
});

export default api;
