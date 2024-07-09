import { Hono } from 'hono';
import { Technology } from '../models/technology';
import { isValidObjectId } from 'mongoose';

const api = new Hono().basePath('/technologies');

api.get('/', async (c) => {
  const technologies = await Technology.find();
  return c.json(technologies, 200);
});

api.get('/:id', async (c) => {
  const _id = c.req.param('id');

  if (isValidObjectId(_id)) {
    const oneTechnology = await Technology.findOne({ _id });

    if (!oneTechnology) {
      return c.json({ msg: 'Technologie non trouvée' }, 404);
    }

    return c.json(oneTechnology);
  }

  return c.json({ msg: 'ObjectId mal formaté' }, 400);
});

api.post('/', async (c) => {
  const body = await c.req.json();

  try {
    const newTechnology = new Technology(body);
    const saveTechnology = await newTechnology.save();
    return c.json(saveTechnology, 201);
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

  const tryToUpdate = await Technology.findOneAndUpdate(q, updateQuery, {
    new: true,
  });

  if (!tryToUpdate) {
    return c.json({ msg: 'Technologie non trouvée' }, 404);
  }

  return c.json(tryToUpdate, 200);
});

api.delete('/:id', async (c) => {
  const _id = c.req.param('id');

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToDelete = await Technology.deleteOne({ _id });
  const { deletedCount } = tryToDelete;

  if (deletedCount) {
    return c.json({ msg: `Technologie avec l'id ${_id} supprimée avec succès` });
  }

  return c.json({ msg: 'Technologie non trouvée' }, 404);
});

export default api;
