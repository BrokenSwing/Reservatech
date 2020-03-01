import { Router } from 'express';

import eventsController from '../controllers/events.controller';
import organizationsController from '../controllers/organizations.controller';
import usersController from '../controllers/users.controller';
import authController from '../controllers/auth.controller';

import { authenticated } from '../middlewares/auth.middleware';

export function apiRoutes(): Router {

  const router = Router();

  // AUTH API //

  router.post('/auth', authController.generateToken);

  // EVENTS API //

  router.get('/events', eventsController.listAll);

  // USERS API //

  router.get('/users', usersController.listAll);
  router.post('/users', usersController.createOne);

  router.get('/users/:id', authenticated(false), usersController.findOneById);
  router.patch('/users/:id', usersController.patchOne);
  router.delete('/users/:id', usersController.deleteOne);

  // ORGANIZATIONS API //

  router.get('/organizations', organizationsController.listAll);

  return router;
}
