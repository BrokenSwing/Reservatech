import { User } from '../models/user';

export const Errors = {
  NOT_FOUND: new Error('User not found'),
  INTERNAL: new Error('Unknown error'),
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
