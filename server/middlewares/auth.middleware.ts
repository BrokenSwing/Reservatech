import { Request, Response, NextFunction } from 'express';
import * as tokensService from '../services/tokens.service';

const BEARER_LENGTH = 'Bearer '.length;

export type AuthenticatedRequest = Request & { userInfo: tokensService.TokenInfo };

/**
 * Checks if the incoming request has a bearer token, then tries to validate this token.
 * This middleware sends 401 HTTP code if no token or an invalid token were provided.
 * If the provided token is valid, it stores token's info in request object.
 *
 * @param req the request to authenticate
 * @param res the response for the incoming request
 * @param next the function to call to forward request to next request handler
 */
export function authenticated(req: Request, res: Response, next: NextFunction) {

  const authorizationHeader = req.header('Authorization');
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {

    const token = authorizationHeader.substring(authorizationHeader.length - BEARER_LENGTH);
    tokensService.verifyToken(token).then((info) => {

      (req as AuthenticatedRequest).userInfo = info;
      next();

    }).catch((e) => res.status(401).send({ error: e.message }));

  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }

}

export function isRequestAuthenticated(req: Request): req is AuthenticatedRequest {
  return (req as AuthenticatedRequest).userInfo !== undefined;
}
