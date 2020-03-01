import * as usersService from './users.service';
import { PASSWORD_HASH_STRATEGY, Errors as HashErrors } from '../security/hash-strategy';
import {User} from '../models/user';

export const Errors = {
  INVALID_PASSWORD: new Error('Invalid password'),
  UNKNOWN_EMAIL: new Error('Unknown email'),
  INTERNAL: new Error('Internal error'),
};

/**
 * Tries to authenticate the user with the given email, with the given password.
 * This function rejects with Errors.UNKNOWN_EMAIL if no user with the given password was found.
 * This function rejects with Errors.INVALID_PASSWORD if the given password doesn't match the password of the user with the given email.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param email the user email
 * @param password the plain text password for the user with the given email
 *
 * @return the user with the given email if passwords match, else an error
 */
export async function authenticate(email: string, password: string): Promise<User> {

  try {
    const user = await usersService.findByEmail(email);
    const isPasswordValid = await PASSWORD_HASH_STRATEGY.check(password, user.password);

    if (isPasswordValid) {
      return user;
    } else {
      return Promise.reject(Errors.INVALID_PASSWORD);
    }

  } catch (e) {
    switch (e) {
      case usersService.Errors.NOT_FOUND:
        return Promise.reject(Errors.UNKNOWN_EMAIL);
      case HashErrors.HASH_ERROR:
        return Promise.reject(Errors.INVALID_PASSWORD);
      case usersService.Errors.INTERNAL:
        return Promise.reject(Errors.INTERNAL);
    }
  }

}
