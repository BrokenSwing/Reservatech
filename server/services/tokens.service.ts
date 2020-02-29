import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';

const Errors = {
  TOKEN_SIGNING: new Error('Unable to sign token'),
  INVALID_TOKEN: new Error('Invalid token'),
};

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default_jwt_secret';
if (TOKEN_SECRET === 'default_jwt_secret') {
  console.warn('Default secret were used for JWT token secret key. Don\'t use it in production mode.');
}

/**
 * Creates a token identifying the given. This token is signed and then can be sent
 * to client without worries to have this one modify the token.
 * This function rejects with Errors.TOKEN_SIGNING if signing the token failed.
 *
 * @param user the user to create a token for
 *
 * @return the signed token, or an error is signing failed
 */
export async function createTokenFor(user: User): Promise<string> {
  return new Promise<string>(((resolve, reject) => {
    jwt.sign({
      id: user.id,
    }, TOKEN_SECRET, { algorithm: 'HS256' }, (err, token) => {
        if (err) {
          console.error(`Unable to sign token for user ${user}`);
          console.error(err);
          reject(Errors.TOKEN_SIGNING);
        } else {
          resolve(token);
        }
    });
  }));
}

export async function verifyToken(token: string) {
  return new Promise<void>(((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, { algorithms: ['HS256'] }, ((err, decoded) => {
        if (err) {
          reject(Errors.INVALID_TOKEN);
        } else {
          resolve();
        }
    }));
  }));
}
