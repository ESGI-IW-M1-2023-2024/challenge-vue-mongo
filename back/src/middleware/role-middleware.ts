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
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        return c.json({ error: 'Token expired' }, 401);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return c.json({ error: 'Token invalid' }, 401);
      }

      if (error instanceof jwt.NotBeforeError) {
        return c.json({ error: 'Token not active' }, 401);
      }

      return c.json({ error: 'Unknown error on jwt token' }, 401);
    }
  };
};

export default roleMiddleware;
