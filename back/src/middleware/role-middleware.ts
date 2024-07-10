import { MiddlewareHandler } from 'hono';
import { Role, User } from '../models/user';
import jwt from 'jsonwebtoken';
import { myEnv } from '../../conf';

const roleMiddleware = (requiredRole: Role): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const token = c.req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return c.json({ error: 'Unauthorized : No token provided' }, 401);
      }

      const decoded: any = jwt.verify(token, myEnv.secretKey);
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      const roles = [Role.USER, Role.MENTOR, Role.ADMIN];
      if (roles.indexOf(user.role) < roles.indexOf(requiredRole)) {
        return c.json({ error: 'Forbidden access' }, 403);
      }

      c.set('user', user);
      await next();
    } catch (error) {
      // TODO return custom error due to typeof error
      return c.json({ error: 'Unauthorized' }, 401);
    }
  };
};

export default roleMiddleware;
