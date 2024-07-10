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

api.post('/', roleMiddleware(Role.USER), async (c) => {
  const body = await c.req.json();

  try {
    const newComment = new Comment(body);
    const saveComment = await newComment.save();
    return c.json(saveComment, 201);
  } catch (error: any) {
    return c.json(error._message, 400);
  }
});

api.patch('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');
  const body = await c.req.json();
  const q = {
    _id,
  };

  const updateQuery = {
    $set: { ...body },
  };

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const comment = await Comment.findOne({ _id });

  if (!comment) {
    return c.json({ msg: 'Commentaire non trouvé' }, 404);
  }

  if (comment.idUser.toString() !== c.get('user')._id.toString()) {
    return c.json({ msg: "Vous n'êtes pas autorisé à modifier ce commentaire" }, 403);
  }

  const tryToUpdate = await Comment.findOneAndUpdate(q, updateQuery, {
    new: true,
  });

  return c.json(tryToUpdate, 200);
});

api.delete('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToDelete = await Comment.deleteOne({ _id });
  const { deletedCount } = tryToDelete;

  if (deletedCount) {
    return c.json({ msg: `Commentaire avec l'id ${_id} supprimé avec succès` });
  }

  return c.json({ msg: 'Commentaire non trouvé' }, 404);
});

export default api;
