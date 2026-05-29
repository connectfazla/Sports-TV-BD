import { User } from './models';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'role' | 'device_id'>;
      requestId?: string;
    }
  }
}
