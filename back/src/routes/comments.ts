import { Hono } from 'hono';
import { Comment } from '../models/comment';
import { isValidObjectId } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const api = new Hono().basePath('/comments');

api.get('/', roleMiddleware(Role.USER), async (c) => {
  const comments = await Comment.find();
  return c.json(comments, 200);
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');

  if (isValidObjectId(_id)) {
    const oneComment = await Comment.findOne({ _id });

    if (!oneComment) {
      return c.json({ msg: 'Commentaire non trouvé' }, 404);
    }

    return c.json(oneComment);
  }

  return c.json({ msg: 'ObjectId mal formaté' }, 400);
});

export default api;
