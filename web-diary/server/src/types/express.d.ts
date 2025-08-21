import { UserType } from './types/UserType'; // Adjust the import path as needed

declare global {
  namespace Express {
    interface User implements UserType {}
  }
}
