import { Hono } from 'hono';
import { Message } from '../models/message';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const api = new Hono().basePath('/messages');

api.get('/', roleMiddleware(Role.USER), async (c) => {
  const messages = await Message.find();
  return c.json(messages, 200);
});

api.get('/:id', roleMiddleware(Role.USER), async (c) => {
  const { id } = c.req.param();
  try {
    const message = await Message.findById(id);
    return c.json(message, 200);
  } catch (err: any) {
    return c.json({ message: 'Message not found', error: err.message }, 404);
  }
});

api.post('/', roleMiddleware(Role.USER), async (c) => {
  const { idIssue, title, content, idSender, idReceiver } = await c.req.json();
  const loggedUser = c.get('user');

  if (loggedUser.id !== idSender) {
    return c.json({ message: 'You are not allowed to send messages on behalf of another user' }, 403);
  }

  try {
    const message = new Message({ idIssue, title, content, idSender, idReceiver });
    await message.save();
    return c.json(message, 201);
  } catch (err: any) {
    return c.json({ message: 'Error creating message', error: err.message }, 400);
  }
});

api.patch('/:id', roleMiddleware(Role.USER), async (c) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json();
  try {
    const message = await Message.findByIdAndUpdate(id, { title, content }, { new: true });
    return c.json(message, 200);
  } catch (err: any) {
    return c.json({ message: 'Error updating message', error: err.message }, 400);
  }
});

api.delete('/:id', roleMiddleware(Role.USER), async (c) => {
  const { id } = c.req.param();
  try {
    await Message.findByIdAndDelete(id);
    return c.json({ message: 'Message deleted successfully' }, 200);
  } catch (err: any) {
    return c.json({ message: 'Error deleting message', error: err.message }, 400);
  }
});

export default api;
