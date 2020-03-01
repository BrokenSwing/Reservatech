import { Request, Response, NextFunction } from 'express';
import * as tokensService from '../services/tokens.service';

const BEARER_LENGTH = 'Bearer '.length;

export type AuthenticatedRequest = Request & { userInfo: tokensService.TokenInfo };

/**
 * Checks if the incoming request has a bearer token, then tries to validate this token.
 * If the provided token is valid, it stores token's info in request object.
 *
 * When forced = true:
 *  This middleware sends 401 HTTP code if no token or an invalid token were provided.
 *
 * @param force true if authentication must be forced
 */
export const authenticated = (force: boolean = true) => (req: Request, res: Response, next: NextFunction) => {

  const authorizationHeader = req.header('Authorization');
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {

    const token = authorizationHeader.substring(BEARER_LENGTH);
    tokensService.verifyToken(token).then((info) => {

      (req as AuthenticatedRequest).userInfo = info;
      next();

    }).catch((e) => {
      if (force) {
        res.status(401).send({ error: e.message });
      } else {
        next();
      }
    });

  } else {
    if (force) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      next();
    }
  }

};

export function isRequestAuthenticated(req: Request): req is AuthenticatedRequest {
  return (req as AuthenticatedRequest).userInfo !== undefined;
}
