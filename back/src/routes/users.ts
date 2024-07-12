import { Hono } from 'hono';
import { IUser, Role, User } from '../models/user';
import { isValidObjectId, Types } from 'mongoose';
import roleMiddleware from '../middleware/role-middleware';
import { Technology } from '../models/technology';
import { Comment } from '../models/comment';
import { genSalt, hash } from 'bcrypt';
import { Issue } from '../models/issue';

const api = new Hono().basePath('/users');

api.get('/', roleMiddleware(Role.ADMIN), async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const search = c.req.query('search');
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    filter.$or = [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }, { role: searchRegex }];
  }

  try {
    const users = await User.find(filter).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(filter);
    return c.json(
      {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        totalResults: totalUsers,
        results: users.map((user) => {
          const { password, ...rest } = user.toObject();
          return rest;
        }),
      },
      200,
    );
  } catch {
    c.json({ msg: 'Erreur lors de la récupération des utilisateurs' }, 500);
  }
});

api.get('/mentors', roleMiddleware(Role.USER), async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const search = c.req.query('search') || '';
  const skip = (page - 1) * limit;
  const filter: any = { role: Role.MENTOR };

  if (search) {
    filter['technologies.label'] = { $regex: search, $options: 'i' };
  }

  try {
    const mentors = await User.find(filter).skip(skip).limit(limit);
    const totalMentors = await User.countDocuments(filter);
    return c.json(
      {
        page,
        limit,
        totalPages: Math.ceil(totalMentors / limit),
        totalResults: totalMentors,
        results: mentors.map((mentor) => {
          const { password, ...rest } = mentor.toObject();
          return rest;
        }),
      },
      200,
    );
  } catch {
    c.json({ msg: 'Erreur lors de la récupération des mentors' }, 500);
  }
});

api.get('/issues', roleMiddleware(Role.USER), async (c) => {
  const loggedUser = c.get('user');
  const issues = await Issue.find({ idUser: loggedUser._id });
  return c.json(issues, 200);
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');
  const loggedUser = c.get('user');

  if (isValidObjectId(_id)) {
    const oneUser = await User.findOne({ _id });

    if (!oneUser) {
      return c.json({ msg: 'Utilisateur non trouvé' }, 404);
    }

    if (
      loggedUser.role !== Role.ADMIN &&
      oneUser._id.toString() !== loggedUser._id.toString() &&
      oneUser.role !== Role.MENTOR
    ) {
      return c.json({ error: "Vous n'avez pas les droits de voir cet utilisateur" }, 403);
    }

    return c.json(oneUser);
  }

  return c.json({ msg: 'ObjectId mal formaté' }, 400);
});

api.post('/', roleMiddleware(Role.ADMIN), async (c) => {
  const body = await c.req.json();

  try {
    const newUser = new User(body);
    const { password, ...saveUser } = await newUser.save();
    return c.json(saveUser, 201);
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

  if (!isValidObjectId(q._id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const user = await User.findOne({ _id });
  const loggedUser = c.get('user');

  if (!user) {
    return c.json({ msg: 'Utilisateur non trouvé' }, 404);
  }

  if (loggedUser.role !== Role.ADMIN && user._id.toString() !== loggedUser._id.toString()) {
    return c.json({ error: "Vous n'avez pas les droits de modifier cet utilisateur" }, 403);
  }

  if (loggedUser.role !== Role.ADMIN) {
    delete body.role;
    delete body.tokens;
    delete body.issues;
    delete body.comments;
    delete body.likes;
  }

  if (body.password) {
    const salt = await genSalt(10);
    body.password = await hash(body.password, salt);
  }

  const updateQuery = {
    $set: { ...body },
  };

  const updatingUser = await User.findOneAndUpdate(q, updateQuery, {
    new: true,
  });

  const { password, ...updatedUser } = updatingUser!.toObject();
  return c.json(updatedUser, 200);
});

api.delete('/:id', roleMiddleware(Role.ADMIN), async (c) => {
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

api.post('/:id/technologies', roleMiddleware(Role.USER), async (c) => {
  const _id = c.req.param('id');
  const { technologyIds }: { technologyIds: string[] } = await c.req.json();
  const objectIds = technologyIds.map((id) => new Types.ObjectId(id));

  if (!isValidObjectId(_id)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const user = await User.findById(_id);
  const loggedUser = c.get('user');
  if (!user) {
    return c.json({ error: 'Utilisateur non trouvé' }, 404);
  }

  if (loggedUser.role !== Role.ADMIN && user._id.toString() !== loggedUser._id.toString()) {
    return c.json({ error: "Vous n'avez pas les droits d'ajouter des technologies à cet utilisateur" }, 403);
  }

  const technologies = await Technology.find({ _id: { $in: objectIds } });
  if (technologies.length === 0) {
    return c.json({ error: 'Aucune technologies trouvées' }, 404);
  }

  technologies.forEach(async (dbTechnology) => {
    if (
      user.technologies?.some(
        (userTechnology) =>
          dbTechnology.label.toString().toLowerCase() !== userTechnology.label.toString().toLowerCase(),
      )
    ) {
      user.technologies?.push(dbTechnology);
      await user.save();
    }
  });
  return c.json(user, 200);
});

api.delete('/:idUser/technologies/:idTechnology', roleMiddleware(Role.USER), async (c) => {
  const idUser = c.req.param('idUser');
  if (!isValidObjectId(idUser)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const user = await User.findById(idUser);
  const loggedUser = c.get('user');
  if (!user) {
    return c.json({ error: 'Utilisateur non trouvé' }, 404);
  }

  if (loggedUser.role !== Role.ADMIN && user._id.toString() !== loggedUser._id.toString()) {
    return c.json({ error: "Vous n'avez pas les droits de supprimer une technologie à cet utilisateur" }, 403);
  }

  const idTechnology = c.req.param('idTechnology');
  user.technologies = user.technologies?.filter((technology) => technology._id.toString() !== idTechnology);
  await user.save();
  return c.json({ msg: `Technologie avec l'id ${idTechnology} supprimée avec succès de l'utilisateur ${idUser}` });
});

api.get('/:id/comments', roleMiddleware(Role.USER), async (c) => {
  const idUser = c.req.param('id');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ idUser }).skip(skip).limit(limit);
    const totalComments = await Comment.countDocuments({ idUser });
    return c.json(
      {
        page,
        limit,
        totalPages: Math.ceil(totalComments / limit),
        totalResults: totalComments,
        results: comments,
      },
      200,
    );
  } catch {
    return c.json({ msg: "Erreur lors de la récupération des commentaires de l'utilisateur" }, 500);
  }
});

api.post('/:id/comments', roleMiddleware(Role.USER), async (c) => {
  const idMentor = c.req.param('id');
  const loggedUser: IUser = c.get('user');
  const { content } = await c.req.json();

  if (!isValidObjectId(idMentor)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const mentor = await User.findById({ _id: idMentor });

  if (!mentor) {
    return c.json({ msg: 'Mentor non trouvé' }, 404);
  }

  if (idMentor === loggedUser._id.toString()) {
    return c.json({ msg: 'Vous ne pouvez pas commenter votre propre profil' }, 400);
  }

  const newComment = new Comment({
    idUser: loggedUser._id,
    idMentor,
    content,
  });

  mentor.comments?.push(newComment._id);
  await newComment.save();
  await mentor.save();
  return c.json(mentor.comments);
});

api.patch('/:idMentor/comments/:idComment', roleMiddleware(Role.USER), async (c) => {
  const idComment = c.req.param('idComment');
  const loggedUser: IUser = c.get('user');
  const { content } = await c.req.json();

  if (!isValidObjectId(idComment)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const comment = await Comment.findOne({ _id: idComment });

  if (!comment) {
    return c.json({ error: 'Commentaire non trouvé' }, 400);
  }

  if (comment.idUser.toString() !== loggedUser._id.toString()) {
    return c.json({ error: "Vous ne pouvez pas modifier le commentaire d'un autre utilisateur" }, 403);
  }

  comment.content = content;
  await comment.save();
  return c.json(comment, 200);
});

api.delete('/:idMentor/comments/:idComment', roleMiddleware(Role.USER), async (c) => {
  const idComment = c.req.param('idComment');
  const loggedUser: IUser = c.get('user');

  if (!isValidObjectId(idComment)) {
    return c.json({ msg: 'ObjectId mal formaté' }, 400);
  }

  const comment = await Comment.findById(idComment);

  if (!comment) {
    return c.json({ error: 'Commentaire non trouvé' }, 400);
  }

  if (comment.idUser.toString() !== loggedUser._id.toString() || loggedUser.role !== Role.ADMIN) {
    return c.json({ error: "Vous ne pouvez pas supprimer le commentaire d'un autre utilisateur" }, 403);
  }

  await Comment.deleteOne({ _id: idComment });
  return c.json({ msg: `Commentaire avec l'id ${comment._id} supprimé avec succès` }, 201);
});

export default api;
