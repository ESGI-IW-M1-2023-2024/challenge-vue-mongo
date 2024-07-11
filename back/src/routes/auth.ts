import { Hono } from 'hono';
import { User } from '../models/user';
import { myEnv } from '../../conf';
import jwt from 'jsonwebtoken';
import roleMiddleware from '../middleware/role-middleware';
import { Role } from '../models/user';

const api = new Hono().basePath('');

// api.post('/register', async (c) => {
//   const userInfos = await c.req.json();

//   try {
//     const user = new User(userInfos);
//     await user.save();
//     return c.json({ message: 'User registered successfully' });
//   } catch (err: any) {
//     return c.json({ message: 'Error registering user', error: err.message }, 400);
//   }
// });

api.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) return c.json({ message: 'Invalid credentials' }, 400);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return c.json({ message: 'Invalid credentials' }, 400);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, myEnv.secretKey, { expiresIn: '1h' });

    return c.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    return c.json({ message: 'Error logging in', error: err.message }, 400);
  }
});

api.get('/checkLogin', roleMiddleware(Role.USER), async (c) => {
  return c.json({ message: 'User is logged in' });
});

export default api;
