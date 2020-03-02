import { Request, Response, NextFunction } from 'express';
import * as tokensService from '../services/tokens.service';
import * as organizationsService from '../services/organizations.service';

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

/**
 * Checks if the given request is coming from an authenticated user.
 *
 * @param req the request to test
 *
 * @return true if the user who sent the request is authenticated, else false
 */
export function isRequestAuthenticated(req: Request): req is AuthenticatedRequest {
  return (req as AuthenticatedRequest).userInfo !== undefined;
}

/**
 * Checks if the requested resources is owned by the authenticated user.
 * Note: it checks if the request `id` parameter is equal to user id
 *
 * If the resource is owned by the authenticated user, it forwards the request.
 * Else a 401 or 403 response code is sent, depending an authentication state.
 */
export const resourceOwned = () => (req: Request, res: Response, next: NextFunction) => {
    if (isRequestAuthenticated(req)) {
      const id = parseInt(req.params.id, 10);

      if (req.userInfo.userId === id) {
        next();
      } else {
        res.status(403).send({ error: 'Forbidden' });
      }

    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
};

/**
 * Checks if the user trying to access the resources is member of the organization
 * with the id provided in request parameters (id parameter).
 *
 * If the user isn't authenticated, it sends a 401 response code.
 * If the user is authenticated but isn't a member of the organization, it sends a 403 response code.
 * If no organization with the provided id exists, it sends a 404 response code.
 * If an error occurred while retrieving organization members, it sends a 500 response code.
 *
 * If the user is a member of the organization with the provided id, then it
 * forwards the request.
 */
export const isOrganizationMember = () => (req: Request, res: Response, next: NextFunction) => {
  if (isRequestAuthenticated(req)) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).send({ error: 'organization di must be an integer'});
      return;
    }

    organizationsService.findOrganizationMembers(id).then((members) => {
      if (members.includes(req.userInfo.userId)) {
        next();
      } else {
        res.status(403).send({ error: 'Forbidden' });
      }
    }).catch((e) => {
      if (e === organizationsService.Errors.NOT_FOUND) {
        res.status(404).send({ error: e.message });
      } else {
        res.status(500).send({ error: e.message });
      }
    });

  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
};
