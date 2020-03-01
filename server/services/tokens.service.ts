import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const Errors = {
  TOKEN_SIGNING: new Error('Unable to sign token'),
  INVALID_TOKEN: new Error('Invalid token'),
  EXPIRED_TOKEN: new Error('Expired token'),
};

const ALGORITHM: jwt.Algorithm = 'HS256';
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
 * @return the signed token and it's claims, or an error is signing failed
 */
export async function createTokenFor(user: User): Promise<{token: string, info: TokenInfo}> {
  return new Promise(((resolve, reject) => {

    const info: TokenInfo = {
      userId: user.id,
    };

    jwt.sign(info, TOKEN_SECRET, { algorithm: ALGORITHM }, (err, token) => {
        if (err) {
          console.error(`Unable to sign token for user ${user}`);
          console.error(err);
          reject(Errors.TOKEN_SIGNING);
        } else {
          resolve({
            token,
            info,
          });
        }
    });
  }));
}

/**
 * Verifies if the given token is valid (the data didn't change since it has been emitted).
 * This function rejects with Errors.INVALID_TOKEN if signature doesn't match claims.
 * This function rejects with Errors.EXPIRED_TOKEN if the token expired.
 *
 * @param token the token to verify the validity
 *
 * @return the claims in the token, or an error
 */
export async function verifyToken(token: string): Promise<TokenInfo> {
  return new Promise(((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, { algorithms: [ALGORITHM] }, ((err, decoded) => {
        if (err) {
          reject(Errors.INVALID_TOKEN);
        } else {

          const info = decoded as TokenInfo;

          // Test if decoded claims matches our interface
          if (info.userId !== undefined) {
            resolve(info);
          } else {
            // A valid signed token with missing data is considered as expired
            reject(Errors.EXPIRED_TOKEN);
          }

        }
    }));
  }));
}

export interface TokenInfo {

  userId: number;

}
