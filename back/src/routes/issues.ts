import { Hono } from 'hono';
import { Role } from '../models/user';
import { Issue } from '../models/issue';
import { isValidObjectId } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Message } from '../models/message';

const api = new Hono().basePath('/issues');

api.get('/', roleMiddleware(Role.USER), async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const search = c.req.query('search');
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    filter.$or = [{ title: searchRegex }, { status: searchRegex }, { 'technologies.label': searchRegex }];
  }

  try {
    const issue = await Issue.find(filter).skip(skip).limit(limit);
    const totalIssues = await Issue.countDocuments(filter);
    return c.json(
      {
        page,
        limit,
        totalPages: Math.ceil(totalIssues / limit),
        totalResults: totalIssues,
        results: issue,
      },
      200,
    );
  } catch {
    return c.json({ msg: 'Erreur lors de la récupération des issues' }, 500);
  }
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');

  if (isValidObjectId(_id)) {
    const oneIssue = await Issue.findOne({ _id });

    if (!oneIssue) {
      return c.json({ msg: 'Sujet non trouvé' }, 404);
    }

    return c.json(oneIssue);
  }

  return c.json({ msg: 'ObjectId mal formaté' }, 400);
});

api.post('/', roleMiddleware(Role.USER), async (c) => {
  const body = await c.req.json();
  try {
    const issue = new Issue(body);
    await issue.save();
    return c.json(issue, 201);
  } catch (err: any) {
    return c.json({ message: 'Error creating issue', error: err.message }, 400);
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

  if (!isValidObjectId(q._id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToUpdate = await Issue.findOneAndUpdate(q, updateQuery, {
    new: true,
  });

  if (!tryToUpdate) {
    return c.json({ msg: 'Sujet non trouvé' }, 404);
  }

  return c.json(tryToUpdate, 200);
});

api.delete('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const tryToDelete = await Issue.deleteOne({ _id });
  const { deletedCount } = tryToDelete;

  if (deletedCount) {
    return c.json({ msg: `Le sujet avec l'id ${_id} est supprimé avec succès` });
  }

  return c.json({ msg: 'Sujet non trouvé' }, 404);
});

api.get('/:id/messages', roleMiddleware(Role.USER), async (c) => {
  const idIssue = c.req.param('id');

  const messages = await Message.find({ idIssue: idIssue });
  return c.json(messages, 200);
});

export default api;
