import { Hono } from 'hono';
import { User } from '../models/user';
import { isValidObjectId } from 'mongoose';

const api = new Hono().basePath('/users');

api.get('/', async (c) => {
  const users = await User.find();
  return c.json(users, 200);
});

api.get('/:id', async (c) => {
  const _id = c.req.param('id');

  if (isValidObjectId(_id)) {
    const oneUser = await User.findOne({ _id });

    if (!oneUser) {
      return c.json({ msg: 'Utilisateur non trouvé' }, 404);
    }

    return c.json(oneUser);
  }

  return c.json({ msg: 'ObjectId mal formaté' }, 400);
});

api.post('/', async (c) => {
  const body = await c.req.json();

  try {
    const newUser = new User(body);
    const saveUser = await newUser.save();
    return c.json(saveUser, 201);
  } catch (error: any) {
    return c.json(error._message, 400);
  }
});

api.patch('/:id', async (c) => {
  const _id = c.req.param('id');
  const body = await c.req.json();
  const q = {
    _id,
  };

  const updateQuery = {
    $set: { ...body },
  };

  if (!isValidObjectId(q._id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToUpdate = await User.findOneAndUpdate(q, updateQuery, {
    new: true,
  });

  if (!tryToUpdate) {
    return c.json({ msg: 'Utilisateur non trouvé' }, 404);
  }

  return c.json(tryToUpdate, 200);
});

api.delete('/:id', async (c) => {
  const _id = c.req.param('id');

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToDelete = await User.deleteOne({ _id });
  const { deletedCount } = tryToDelete;

  if (deletedCount) {
    return c.json({ msg: `Utilisateur avec l'id ${_id} supprimé avec succès` });
  }

  return c.json({ msg: 'Utilisateur non trouvé' }, 404);
});

export default api;
