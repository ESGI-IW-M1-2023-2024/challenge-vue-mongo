import { IUser } from './models/user';

declare module 'hono' {
  interface ContextVariableMap {
    user: typeof IUser;
  }
}
