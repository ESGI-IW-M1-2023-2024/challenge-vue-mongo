import { Context, Hono } from 'hono';
import { Technology } from '../models/technology';
import { isValidObjectId } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const api = new Hono().basePath('/technologies');

api.get('/', roleMiddleware(Role.USER), async (c: Context<{}, '/technologies/', {}>) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const pagination = c.req.query('pagination') !== 'false';
  const search = c.req.query('search') || '';
  const skip = (page - 1) * limit;
  const filter = { label: { $regex: search, $options: 'i' } };

  if (pagination) {
    try {
      const technologies = await Technology.find(filter).skip(skip).limit(limit);
      const totalTechnologies = await Technology.countDocuments(filter);
      return c.json(
        {
          page,
          limit,
          totalPages: Math.ceil(totalTechnologies / limit),
          totalResults: totalTechnologies,
          results: technologies,
        },
        200,
      );
    } catch {
      return c.json({ msg: 'Erreur lors de la récupération des technologies' }, 500);
    }
  } else {
    try {
      const technologies = await Technology.find(filter);
      const totalTechnologies = await Technology.countDocuments(filter);
      return c.json(technologies, 200);
    } catch {
      return c.json({ msg: 'Erreur lors de la récupération des technologies' }, 500);
    }
  }
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
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

api.post('/', roleMiddleware(Role.ADMIN), async (c) => {
  const body = await c.req.json();

  try {
    const newTechnology = new Technology(body);
    const saveTechnology = await newTechnology.save();
    return c.json(saveTechnology, 201);
  } catch (error: any) {
    return c.json(error._message, 400);
  }
});

api.patch('/:id', roleMiddleware(Role.ADMIN), async (c) => {
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

api.delete('/:id', roleMiddleware(Role.ADMIN), async (c) => {
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
