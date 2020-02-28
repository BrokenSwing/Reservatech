import { User } from '../models/user';
import { PASSWORD_HASH_STRATEGY, Errors as HashErrors } from '../security/hash-strategy';

const PASSWORD_MIN_LENGTH = 10;
const FIRST_NAME_FORMAT = /^[a-zA-Z\u00C0-\u017F\-]{2,20}/;
const LAST_NAME_FORMAT = /^[a-zA-Z\u00C0-\u017F\-]{2,20}/;

export const Errors = {
  NOT_FOUND: new Error('User not found'),
  INTERNAL: new Error('Unknown error'),
  PASSWORD_HASH: new Error('Can\'t hash password'),
  ALREADY_EXISTS: new Error('User already exists'),
  PASSWORD_TOO_SHORT: new Error('Password is too short'),
  FIRST_NAME_WRONG_FORMAT: new Error('First name doesn\'t match required format'),
  LAST_NAME_WRONG_FORMAT: new Error('Last name doesn\'t match required format'),
  EMAIL_WRONG_FORMAT: new Error('Email doesn\'t match required format'),
};

/**
 * Finds the user with the given email.
 * This function rejects with Errors.NOT_FOUND if no user with the given email was found.
 * This function rejects with Errors.INTERNAL if a problem occurred while querying data source.
 *
 * @param email the user email
 * @return the user with the given email, or and indicating which problem occurred
 */
export async function findByEmail(email: string): Promise<User> {

  try {
    const user = User.findOne({
      where: {
        email
      }
    });

    if (user !== null) {
      return Promise.resolve(user);
    }

    return Promise.reject(Errors.NOT_FOUND);

  } catch (e) {
    console.error(`Unable to fetch user from email: ${email}`);
    console.error(e);
    return Promise.reject(Errors.NOT_FOUND);
  }

}

/**
 * Finds the user with the given id.
 * This function rejects with Errors.NOT_FOUND if no user with the given id was found.
 * THis function rejects with Errors.INTERNAL if a problem occurred while querying data source
 *
 * @param id the user id
 * @return the user with the given id or an error indicating which error occurred
 */
export async function findById(id: number): Promise<User> {

  try {
    const user = await User.findByPk(id);

    if (user !== null) {
      return Promise.resolve(user);
    }

    return Promise.reject(Errors.NOT_FOUND);

  } catch (e) {
    console.error(`Unable to fetch from id: ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Fetches all known users.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @return an array of users or an error
 */
export async function findAll(): Promise<User[]> {

  try {
    const users = await User.findAll();
    return Promise.resolve(users);
  } catch (e) {
    console.error('Unable to fetch all users.');
    console.log(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Creates an user from the given arguments.
 *
 * First name must match FIRST_NAME_FORMAT, else it rejects with Errors.FIRST_NAME_WRONG_FORMAT.
 * Last name must match LAST_NAME_FORMAT, else it rejects with Errors.LAST_NAME_WRONG_FORMAT.
 * Email must be a valid email, else it rejects with Errors.EMAIL_WRONG_FORMAT.
 * Password must be longer than or equal to PASSWORD_MIN_LENGTH, else it rejects with Errors.PASSWORD_TOO_SHORT.
 *
 * This function rejects with Errors.ALREADY_EXISTS if an user with the given email already exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param firstName the user first name
 * @param lastName the user last name
 * @param email the user email
 * @param plainPassword the user password, not hashed
 *
 * @return the user once created, or an error indicating which problem occurred
 */
export async function createUser(firstName: string, lastName: string, email: string, plainPassword: string): Promise<User> {

  if (!FIRST_NAME_FORMAT.test(firstName)) {
    return Promise.reject(Errors.FIRST_NAME_WRONG_FORMAT);
  }

  if (!LAST_NAME_FORMAT.test(lastName)) {
    return Promise.reject(Errors.LAST_NAME_WRONG_FORMAT);
  }

  if (plainPassword.length < PASSWORD_MIN_LENGTH) {
    return Promise.reject(Errors.PASSWORD_TOO_SHORT);
  }

  try {
    const hashedPassword = await PASSWORD_HASH_STRATEGY.hash(plainPassword);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return Promise.resolve(user);
  } catch (e) {
    if (e === HashErrors.HASH_ERROR) {
      return Promise.reject(Errors.PASSWORD_HASH);
    } else if (e.name !== undefined && e.name === 'SequelizeUniqueConstraintError') {
      return Promise.reject(Errors.ALREADY_EXISTS);
    } else if (e.name !== null && e.name === 'SequelizeValidationError') {
      return Promise.reject(Errors.EMAIL_WRONG_FORMAT);
    } else {
      console.error('Error while creating an user');
      console.error(e);
      return Promise.reject(Errors.INTERNAL);
    }
  }

}
